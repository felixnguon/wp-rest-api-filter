<?php
namespace AmagumoLabs\wprestapifilter\Shortcodes;
use AmagumoLabs\wprestapifilter\Plugin;
use AmagumoLabs\wprestapifilter\Helpers;

/**
 * Post_Shortcode
 * @author Duc
 * @since 1.0.0
 */
class Post_Shortcode extends Plugin
{

  /**
	 * Constructor
	 */
  public function __construct() {
    /**
     * Register [ykvn_post_filter] shortcode for the dropdown filter
     */
    if ( ! shortcode_exists( 'ykvn_post_filter' ) ) {
      add_shortcode( 'ykvn_post_filter', array( $this, 'ykvn_post_filter_shortcode' ) );
    }
    /**
     *    hook.
     * Enables adding extra arguments or setting defaults for a post collection request.
     */
    add_filter( 'rest_post_query', array( $this, 'ykvn_post_meta_request_params' ), 99, 2 );

    add_action('rest_api_init', array( $this, 'wraf_register_rest_fields' ));
    /**
     *    deprecated since we use WordPress Rest API
     * Register [ykvn_post_filter] shortcode for the dropdown filter
     */
    $this->setup_ajax_handlers();
  }

  public function wraf_register_rest_fields() {
    register_rest_field('post',
      'feature_image_src',
      array(
        'get_callback'    => array( $this, 'get_rest_post_feature_image' ),
        'update_callback' => null,
        'schema'          => null
      )
    );
  }

  function get_rest_post_feature_image($object,$field_name,$request) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'medium' );
        return $img[0];
    }
    return false;
  }

/**
  * Add meta fields support in rest API for posttype `Post`
  *
  * @since 1.0.0
  *
  * @link    https://codex.wordpress.org/Class_Reference/WP_Query
  *
  * @param   array   $args       Contains by default pre written params.
  * @param   array   $request    Contains params values passed through URL request.
  * @return   array   $args       New array with added custom params and its values.
  */
  function ykvn_post_meta_request_params( $args, $request )
	{
    /**
     * Get the parameters from the request URL
     */
    $url_params = $request->get_query_params();
    $args_meta = array();
    if(isset($url_params["search"])) {
      //TODO: add support for search

    } else {
      foreach($url_params as $meta_key => $value) {
        /**
          * Add the meta key & value into query builder
          * Make sure that the meta_key is not 'after', 'before', 'categories'
          */
        if($meta_key != "after" && $meta_key != "before" && $meta_key != "categories") {
          $args_meta[] = array(
            'key' => $meta_key,
            'value' => $value,
            'compare' => '='
          );
        }
      }

      /**
        * Construct the meta query with AND operator
        */
      $args += array(
        'meta_query' => array(
          'relation' => 'AND',
          $args_meta,
          'categories' => ''
        )
      );

    }

	  return $args;
	}

/**
  * Registers the callback functions
  *    deprecated
  *    hook.
  * @since 1.0.0
  */
  public function setup_ajax_handlers() {
    // Responsible for providing a response when a taxonomy value is clicked from the dropdown.
    add_action( 'wp_ajax_nopriv_filter_post_by_taxonomy_ajax', array( $this, 'filter_post_by_taxonomy_ajax' )  );
    add_action( 'wp_ajax_filter_post_by_taxonomy_ajax', array( $this, 'filter_post_by_taxonomy_ajax' ) );
  }

/**
  * Ajax handler for 'filter_post_by_taxonomy_ajax' call.
  *    deprecated
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
  * A short code that renders Filter/Search Layout, if provided
  *
  * @param $atts array Shortcode Attributes
  * @return string Output of shortcode
  * @since 1.0.0
  */
  public function ykvn_post_filter_shortcode( $atts ) {
    global $wp;

    /**
      * Get the attribute values from shortcode
      */
    $atts = shortcode_atts( array(
      'posttype' => 'posts',
      'placeholder' => 'Keywords',
      'taxonomy' => '',
      'meta' => array('taxanomy_practice'),
      'categories' => array(''),
      'class' => ''
    ), $atts, 'ykvn_post_filter' );

    /**
      * Get the category id by slug
      */
    $category_id = "";
    if($atts['categories']) {
      $category_id = get_term_by('slug', $atts['categories'], 'category')->term_id;
    }

    /**
      * Interpolate the filter options
      */
    if(!empty($atts[ 'meta' ])) {
    /**
      * Convert string request into array
      */
      $terms = Helpers::convert_string_to_array($atts[ 'meta' ], ",");

      $preloader = '<div class="ball-pulse"><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div></div>';
      $html = '<div class="wraf-wrapper">';

      /* START SEARCH FORM */
      $searchform = '<form data-rest-url="'.get_rest_url( null, 'wp/v2/' ).'" class="'.self::$textdomain.'-searchteam posts" method="get" id="'.self::$textdomain.'searchteam" action="' .home_url("/"). '">
      <label><span class="screen-reader-text">'.sprintf( __( '%s', self::$textdomain ), $atts[ 'placeholder' ] ).'</span><input type="search" class="search-field" placeholder="'.sprintf( __( '%s', self::$textdomain ), $atts[ 'placeholder' ] ).'" value="' . get_search_query() . '" name="a" title="'.sprintf( __( '%s', self::$textdomain ), $atts[ 'placeholder' ].":" ).'" /></label>
      <button type="button" data-posttype="'.$atts[ 'posttype' ].'" data-type-filter="meta" class="'.self::$textdomain.'-submit" data-taxonomy="'.$atts[ 'taxonomy' ].'" data-categories="'.$category_id.'" ><span class="screen-reader-text">Search</span><svg class="mk-svg-icon" data-name="mk-icon-search" data-cacheid="icon-5dedcecf221b9" style=" height:25px; width: 23.214285714286px; " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1792"><path d="M1152 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"></path></svg></button>
      </form>';

      $html .= $searchform;
      /* END SEARCH FORM */

      /* START META FILTER DROPDOWN */
      foreach($terms as $term) {
        $options = acf_get_field($term);
        $term_options = '';
        if(!empty($options['choices'])) {
          foreach(  $options['choices'] as $value => $label ):
            $term_options .= '<option value="'.$value.'" class="'.self::$textdomain.'-dropdown__list-item">'.$label.'</option>';
          endforeach;
        }

        $html .= '<div class="'.self::$textdomain.'-dropdown-wrapper"><select id="'.self::$textdomain.'-select-'.$atts[ 'posttype' ].'-'.$term.'" data-categories="'.$category_id.'" data-id="'.self::$textdomain.'-select-'.$atts[ 'posttype' ].'-'.$term.'" data-label="'.sprintf( __( '%s', self::$textdomain ), $options['label'] ).'" class="'.self::$textdomain.'-select-dropdown '.$atts[ 'posttype' ].'" data-type-filter="meta" data-posttype="'.$atts[ 'posttype' ].'" data-taxonomy="" data-term="'.$term.'">'.$term_options.'</select></div>';
      }
      /* END META FILTER DROPDOWN */

      /* START TIME FILTER DROPDOWN */
      $date_range = array(
        "week-1" => "1 week",
        "month-1" => "1 month",
        "month-3" => "3 months",
        "month-6" => "6 months",
        "" => "1 year +"
      );

      $date_options = '';
      foreach( $date_range as $value => $label):
        $date_options .= '<option value="'.$value.'" class="'.self::$textdomain.'-dropdown__list-item">'.$label.'</option>';
      endforeach;

      $html .= '<div class="'.self::$textdomain.'-dropdown-wrapper"><select id="'.self::$textdomain.'-select-'.$atts[ 'posttype' ].'-date" data-categories="'.$category_id.'" data-id="'.self::$textdomain.'-select-'.$atts[ 'posttype' ].'-date" data-label="'.sprintf( __( '%s', self::$textdomain ), check_current_language('Date', 'Ngày') ).'" class="'.self::$textdomain.'-select-dropdown '.self::$textdomain.'-rangePicker'.$atts[ 'posttype' ].'" data-type-filter="meta" data-posttype="'.$atts[ 'posttype' ].'" data-taxonomy="" data-term="after">'.$date_options.'</select></div>';
       /* END TIME FILTER DROPDOWN */

      /* START RESET FILTER */
      $html .= '<a class="'.self::$textdomain.'-dropdown-reset '.$atts[ 'posttype' ].'"  href="#" data-posttype="'.$atts[ 'posttype' ].'" data-taxonomy="'.$atts[ 'taxonomy' ].'" >'.check_current_language('Reset Filter', 'Thiết lập lại').'</a>';
      $html .= "</div>";
      /* END RESET FILTER */

      return $html;
    }
  }
}