<?php
/**
 * @wordpress-plugin
 * Plugin Name:       WP rest API filter
 * Plugin URI:        https://github.com/ducnguon/wp-rest-api-filter
 * Description:       A WordPress Rest API search/filter plugin
 * Version:           1.0.0
 * Author:            Felix
 * Author URI:        https://github.com/ducnguon
 * License:           GPL-2.0
 * License URI:       https://opensource.org/licenses/GPL-2.0
 * Text Domain:       wraf
 * Domain Path:       languages
 * GitHub Plugin URI: ducnguon/wp-rest-api-filter
 */

/*	Copyright 2021	  Duc (https://github.com/ducnguon)

	This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

if( !defined( 'ABSPATH' ) ) die();

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
  require( __DIR__ . '/vendor/autoload.php' );
}


include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
$settings = array(
  'data' => get_plugin_data(__FILE__),
  'path' => realpath(plugin_dir_path(__FILE__)).DIRECTORY_SEPARATOR,
  'url' => plugin_dir_url(__FILE__),
  'textdomain' => 'wraf',
  'prefix' => 'wraf'
);

// Initialize plugin
\AmagumoLabs\wprestapifilter\Plugin::instance($settings);