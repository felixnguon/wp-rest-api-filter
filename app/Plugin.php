<?php

namespace AmagumoLabs\wprestapifilter;

if( ! class_exists( 'Plugin' )) {
    class Plugin {
        private static $instance;
        public static $textdomain;
        public static $config;

        public static function instance($settings = null) {

            if ( !isset( self::$instance ) && !( self::$instance instanceof Plugin ) ) {

              self::$instance = new Plugin;

              // Load plugin configuration
              self::$config = $settings;

              // Set Text Domain
              self::$textdomain = 'wraf';
              // Load dependecies and load plugin logic
              register_activation_hook( __FILE__ , array( self::$instance, 'activate' ) );
              add_action( 'plugins_loaded', array( self::$instance, 'load_dependencies' ) );
            }

            return self::$instance;

        }

        /**
          * Append a field prefix as defined in $config
          *
          * @param string $field_name The string/field to prefix
          * @param string $before String to add before the prefix
          * @param string $after String to add after the prefix
          * @return string Prefixed string/field value
          * @since 1.0.0
          */
          public static function prefix( $field_name = null, $before = '', $after = '_' ) {

            $prefix = $before . self::$config['prefix'] . $after;
            return $field_name !== null ? $prefix . $field_name : $prefix;

          }

        /**
          * Load plugin classes - Modify as needed, remove features that you don't need.
          *
          * @since 1.0.0
          */
        public function load_plugin() {
          // Enqueue scripts and stylesheets
          new EnqueueScripts();
        }
        /**
          * Initialize Carbon Fields and load plugin logic
          *
          * @since 1.0.0
          */
        public function load_dependencies() {
          $this->load_plugin();
        }
        /**
          * Action on activation.
          *
          * @since 1.0.0
          */
        public function activate() {

        }

    }
}