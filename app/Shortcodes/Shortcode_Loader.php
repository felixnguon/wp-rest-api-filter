<?php
namespace AmagumoLabs\wprestapifilter\Shortcodes;
use AmagumoLabs\wprestapifilter\Plugin;

class Shortcode_Loader extends Plugin {

  /**
   * @var array Shortcode class name to register
   * @since 1.0.0
   */
  protected $shortcodes;

  public function __construct() {

    $this->shortcodes = array(
      Team_Shortcode::class,
      Post_Shortcode::class
    );

    foreach( $this->shortcodes as $shortcodeClass ) {
      if( class_exists( $shortcodeClass ) ) new $shortcodeClass();
    }
  }

}
