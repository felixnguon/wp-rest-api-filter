<?php
namespace AmagumoLabs\wprestapifilter;


class EnqueueScripts extends Plugin {
    function __construct() {

        // Enqueue frontend/backend scripts
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ) );
        //add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

    }

    /**
    * Enqueue scripts used on frontend of site
    * @since 1.0.0
    */
    public function enqueue_frontend_scripts() {

        // Enqueue script dependencies
        $this->enqueue_common_scripts();

        // Enqueuing custom CSS for child theme (Twentysixteen was used for testing)
        wp_enqueue_style( 'wprestapifilter', Helpers::get_script_url( 'assets/css/wprestapifilter.css' ), null, Helpers::get_script_version( 'assets/css/wprestapifilter.css' ) );

        // Enqueue frontend JavaScript
        wp_enqueue_script( 'wprestapifilter', Helpers::get_script_url( 'assets/js/wprestapifilter.js' ), array( 'jquery' ), Helpers::get_script_version( 'assets/js/wprestapifilter.js' ), true );

        //wp_localize_script( 'wprestapifilter', $this->prefix( 'ajax_filter_params' ), array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
        wp_localize_script( 'wprestapifilter', $this->prefix( 'ajax_filter_params' ), array( 'json_url' => rest_url('wp/v2/'), 'ajax_url' => admin_url( 'admin-ajax.php' ), 'ajax_nonce' => wp_create_nonce('wp_rest') ) );
    }

    /**
    * Enqueue scripts common to the public site and WP Admin
    * @since 1.0.0
    */
    private function enqueue_common_scripts() {
    }

    /**
    * Enqueue scripts used in WP admin interface
    * @since 0.1.0
    */
    public function enqueue_admin_scripts() {

        // Enqueue script dependencies
        $this->enqueue_common_scripts();

        // Enqueuing custom CSS for child theme
        wp_enqueue_style( 'wprestapifilter', Helpers::get_script_url( 'assets/css/wprestapifilter-admin.css' ), null, Helpers::get_script_version( 'assets/css/wprestapifilter-admin.css' ) );

        // Enqueue WP Admin JavaScript
        wp_enqueue_script( 'wprestapifilter-admin', Helpers::get_script_url( 'assets/js/wprestapifilter-admin.js' ), array('jquery'), Helpers::get_script_version( 'assets/js/wprestapifilter-admin.js' ), true );
        wp_localize_script( 'wprestapifilter-admin', $this->prefix( 'ajax_filter_params' ), array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );

    }
}

