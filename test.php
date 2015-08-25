<?php
/**
 *      Created in 18/06/15 0.47
 *
 *      Copyright 2015
 *
 * @author Daniele Pignedoli <daniele.pignedoli@gmail.com>
 *
 * @license <a href="http://www.gnu.org/licenses/gpl.html" target="_new">
 *      http://www.gnu.org/licenses/gpl.html</a><br /><br />
 *      This program is free software; you can redistribute it and/or modify<br />
 *      it under the terms of the GNU General Public License as published by<br />
 *      the Free Software Foundation; either version 2 of the License, or<br />
 *      (at your option) any later version<br />
 *      <br />
 *      This program is distributed in the hope that it will be useful,<br />
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 *      GNU General Public License for more details:<br />
 *      <b>http://www.gnu.org/licenses/gpl.html</b><br />
 *      <br />
 *      You should have received a copy of the GNU General Public License<br />
 *      along with this program; if not, write to the Free Software<br />
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,<br />
 *      MA 02110-1301, USA<br />
 * */

ini_set('display_errors', TRUE);
ini_set('error_reporting', E_ALL);
ini_set('html_errors', E_ALL);

$photo_dir = opendir('./photos');
$photos = array();
while($photo = readdir($photo_dir)) {
  if(stristr($photo, 'jpg')) {
    array_push($photos, $photo);
  }
}
sort($photos);

$exifs = array();
foreach($photos as $photo) {
  $exifs[] = exif_read_data("photos/{$photo}");
}

// Kml, simplexml dont get the when and coords objects...so lets use regexp.
$contents = file_get_contents('kml/1.kml');
preg_match_all('#(<when>)([0-9\-T\.\:]+)(<\/when>)#', $contents, $whens);
preg_match_all('#(<gx\:coord>)([0-9\-\. ]+)(<\/gx\:coord>)#', $contents, $coords);

array_walk($whens[2], function (&$item, $key) {
    $dateTime = new DateTime($item);
    $item = $dateTime->getTimestamp();
  }
);

$locations = array_combine(
  $whens[2],
  $coords[2]
);

foreach($exifs AS $i => $exif) {
  print_r($exif['DateTime']);
  $dateTime = new DateTime($exif['DateTime']);
  $exifs[$i]['unix'] = $dateTime->getTimestamp();

  $log = '';

  //print_r($exifs[$i]);
  if(isset($exif['GPSLatitude'])) {
    $latitude = gps($exif["GPSLatitude"], $exif['GPSLatitudeRef']);
    $longitude = gps($exif["GPSLongitude"], $exif['GPSLongitudeRef']);
    $log .= '<br><i>Lat/Lon got from gps(): ' . $latitude . '/' . $longitude . '</i><br>';
  } else {
    $gpsDate = closestDate(array_keys($locations), $exifs[$i]['unix']);
    list($longitude, $latitude, $null) = explode(" ", $locations[$gpsDate]);
    $log .= '<br>Lat/Lon got from closestDate(): ' . $latitude . '/' . $longitude . '<br>';
  }
  $exifs[$i]['lat'] = $latitude;
  $exifs[$i]['lon'] = $longitude;


  echo '<hr><img src="/photos/' . $exifs[$i]['FileName'] . '" width="200" /><br>Filename: ' . $exifs[$i]['FileName'] . ', date: ' . date("d/m/Y", $exifs[$i]['unix']) . ' | ' . $exifs[$i]['lat'] . ' ' . $exifs[$i]['lon'] . $log . '<br><br>';
}


/**
 * @param $coordinate
 * @param $hemisphere
 *
 * @return int
 * @url http://stackoverflow.com/questions/2526304/php-extract-gps-exif-data
 */
function gps($coordinate, $hemisphere)
{
  for($i = 0; $i < 3; $i++) {
    $part = explode('/', $coordinate[$i]);
    if(count($part) == 1) {
      $coordinate[$i] = $part[0];
    } else if(count($part) == 2) {
      $coordinate[$i] = floatval($part[0]) / floatval($part[1]);
    } else {
      $coordinate[$i] = 0;
    }
  }
  list($degrees, $minutes, $seconds) = $coordinate;
  $sign = ($hemisphere == 'W' || $hemisphere == 'S') ? -1 : 1;
  return $sign * ($degrees + $minutes / 60 + $seconds / 3600);
}


/**
 * @param $dateList array unix timestamps
 * @param $date string unix timestamp
 *
 * @return string closest match between $date and $dateList elements.
 */
function closestDate($dateList, $date)
{
  if(1 === count($dateList)) {
    return $dateList[0];
  } elseif(1 < count($dateList)) {
    $gap = null;
    $closest = '';
    foreach($dateList AS $i => $testDateTime) {
      if($testDateTime == $date) {
        return $date;
      } else {
        if(is_null($gap)) {
          $gap = abs($testDateTime - $date);
          $closest = $i;
        } else {
          if($gap > abs($testDateTime - $date)) {
            $gap = abs($testDateTime - $date);
            $closest = $i;
          }
        }
      }
    }
    return $dateList[$closest];
  }
  return 0;
}




/**
 * Class PhotoExifs
 */
class PhotoExifs
{
  public $photos = array();

  /**
   *
   */
  public function __construct()
  {
    return $this;
  }

  /**
   * @param string $path The path of the directory that contains the photos.
   * @param bool   $readExif If true, automatically read exifs data.
   *
   * @return PhotoExifs $this
   * @throws PhotoExifs404Exception
   * @throws PhotoExifs403Exception
   */
  public function fromPath($path = '', $readExif = TRUE)
  {
    if(is_readable($path)) {
      $photo_dir = opendir($path);
      while($photo = readdir($photo_dir)) {
        if(stristr($photo, 'jpg') || stristr($photo, 'png')) {
          array_push($this->photos, new PhotoExifsElement($path, $photo));
        }
      }
      closedir($photo_dir);
      if($readExif === TRUE) {
        $this->readExif();
      }
    } else {
      if(!file_exists($path)) {
        throw new PhotoExifs404Exception(sprintf('Path does not exist: %s', $path));
      }
      // If it exists, must be not readable.
      throw new PhotoExifs403Exception(sprintf('Path is not readable: %s', $path));
    }
    return $this;
  }

  /**
   * Sort the photos array by date, default ASC
   *
   * @param string $order 'asc' or 'desc', default 'asc'
   *
   * @return PhotoExifs $this
   */
  public function sortByDate($order = 'asc')
  {
    uasort($this->photos, function ($a, $b) use ($order) {
      if('asc' == $order) {
        return $a->exif['unixTime'] < $b->exif['unixTime'] ? -1 : 1;
      } else {
        return $a->exif['unixTime'] > $b->exif['unixTime'] ? -1 : 1;
      }
    });

    // Manually reorder; using sort() cause any subsequent
    // calls to the function to not work anymore!
    $photos = array();
    $i = 0;
    foreach($this->photos AS $photo) {
      $photos[$i] = $photo;
      $i++;
    }
    $this->photos = $photos;
    return $this;
  }

  /**
   * Just tell every PhotoExifsElement to read itself exifs.
   * @return PhotoExifs $this
   */
  public function readExif()
  {
    foreach($this->photos as $photo) {
      $photo->readExif();
    }
    return $this;
  }

  /**
   * @param bool  $n Number of leading padding chars
   * @param array $options
   *
   * @return $this
   */
  public function renamePhotosByDate($n = FALSE, $options = array())
  {
    if(FALSE === $n || $n < strlen(count($this->photos))) {
      $n = strlen(count($this->photos));
    }
    $paddingChar = isset($options['char']) ? $options['char'] : '0';
    foreach($this->photos AS $i => $photo) {
      $i++;
      $name = sprintf(
        "%s-%s_%s",
        date('ymd', $photo->exif['unixTime']),
        str_pad($i, $n, $paddingChar, STR_PAD_LEFT),
        date('d-m-Y.H-i-s', $photo->exif['unixTime'])
      );
      $photo->setNewName($name . '_' . $photo->model);
    }
    return $this;
  }

  public function log()
  {
    foreach($this->photos AS $i => $photo) {
      printf('[%s] - %s | %s<hr>', $i, $photo->exif['unixTime'], $photo->filename);
    }
    return $this;
  }
}

/**
 * Class PhotoExifsElement
 */
class PhotoExifsElement
{
  public $path = '', $oldPath = '', $name = '', $model = '', $exif = array();

  /**
   * @param string $path The path of the photo.
   * @param string $name C'mon dude, the filename.
   */
  public function __construct($path, $name)
  {
    $this->path = $path;
    $this->filename = $name;
    $this->fullpath = $path . '/' . $name;
    return $this;
  }

  /**
   * @param     $bytes
   * @param int $decimals
   *
   * @return string
   */
  public function humanFilesize($bytes, $decimals = 2)
  {
    $sz = 'BKMGTP';
    $factor = floor((strlen($bytes) - 1) / 3);
    return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
  }

  /**
   * @return $this
   */
  public function readExif()
  {
    $this->exif = exif_read_data($this->fullpath);
    $this->exif['unixTime'] = $this->exif['FileDateTime'];
    if(isset($this->exif['UndefinedTag:0xA434'])) {
      $this->model = $this->exif['UndefinedTag:0xA434'];
    } else if(isset($this->exif['Model'])) {
      $this->model = $this->exif['Model'];
    } else {
      $this->model = 'unknow';
    }
    $this->model = strtolower(preg_replace('#[^\w]#', '.', $this->model));
    $this->model = preg_replace('#[\.]+#', '.', $this->model);
    return $this;
  }

  /**
   * @param      $name
   * @param null $ext
   *
   * @return $this
   * @throws PhotoExifs403Exception
   */
  public function setNewName($name, $ext = null)
  {
    $this->oldPath = $this->fullpath;
    if(!is_null($ext)) {
      $this->filename = $name . $ext;
    } else {
      $this->filename = $name . substr($this->filename, strrpos($this->filename, '.'), 10);
      $this->fullpath = $this->path . '/' . $this->filename;
    }
    if(is_writable($this->oldPath)) {
      rename($this->oldPath, $this->fullpath);
    } else {
      throw new PhotoExifs403Exception('Photo file is not writable, cant rename:' . $this->oldPath);
    }
    return $this;
  }
}

/**
 * Class PhotoExifs404Exception
 * Path (file/directory) not found.
 */
class PhotoExifs404Exception extends Exception
{
}

/**
 * Class PhotoExifs403Exception
 * Forbidden to access resource/variable.
 */
class PhotoExifs403Exception extends Exception
{
}


//$pE = new PhotoExifs();
//$pE->fromPath('./photos');
//$pE->sortByDate();
//$pE->renamePhotosByDate();

