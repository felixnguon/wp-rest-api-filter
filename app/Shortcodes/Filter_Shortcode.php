<?php
namespace AmagumoLabs\wprestapifilter\Shortcodes;
use AmagumoLabs\wprestapifilter\Plugin;

class Team_Shortcode extends Plugin
{

  public function __construct() {

    if ( ! shortcode_exists( 'wprestapifilter' ) ) {
        add_shortcode( 'wprestapifilter', array( $this, 'wprestapifilter_shortcode' ) );
    }

    add_action('rest_api_init', array( $this, 'wraf_register_rest_fields' ));

    $this->setup_ajax_handlers();
  }


  public function wraf_register_rest_fields() {

  }

  /**
    * Registers the callback functions
    *
    * Note: If this Ajax call was intended to be available to those who are not
    *    logged in, you would need to uncommend the 'wp_ajax_nopriv_clear_object_cache_ajax'
    *    hook.
    * @since 1.0.0
    */
    public function setup_ajax_handlers() {
      // responsible for providing a response when a taxonomy value is clicked from the dropdown.
      add_action( 'wp_ajax_nopriv_filter_post_by_taxonomy_ajax', array( $this, 'filter_post_by_taxonomy_ajax' )  );
      add_action( 'wp_ajax_filter_post_by_taxonomy_ajax', array( $this, 'filter_post_by_taxonomy_ajax' ) );
    }

  /**
    * Ajax handler for 'filter_post_by_taxonomy_ajax' call.
    * @since 1.0.0
    */
    public function filter_post_by_taxonomy_ajax() {

      $result = [ 'success' => true ];

      try {
        // self::$cache->flush();
      } catch ( Exception $e ) {
        $result = [ 'success' => false, 'message' => $e->getMessage() ];
      }

      echo json_encode( $result );
      wp_die();

    }

  /**
   * A short code that renders Search Layout, if provided
   *
   * @param $atts array Shortcode Attributes
   * @return string Output of shortcode
   * @since 1.0.0
   */
  public function wprestapifilter_shortcode( $atts ) {
    global $wp;
    return "";
  }
}