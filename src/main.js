/*
 * @preserve: Custom JavaScript Logic - Frontend
 */

import useDropdown from './components/useDropdown'
import { PREFIX } from './config'

var WRAF_NS = WRAF_NS || {}

;(function ($, undefined) {
  WRAF_NS.Site = {
    initializeDropdown: function () {
      var select = document.getElementsByClassName('wraf-select-dropdown'),
        liElement,
        ulElement,
        optionValue,
        iElement,
        optionText,
        selectDropdown,
        elementParentSpan

      if (typeof select != 'undefined' && select != null) {
        for (
          var select_i = 0, len = select.length;
          select_i < len;
          select_i++
        ) {
          select[select_i].style.display = 'none'
          useDropdown.useDropdown(select[select_i], select_i)
        }
        var buttonSelect = document.getElementsByClassName(
          PREFIX + '-dropdown__button'
        )
        if (typeof buttonSelect != 'undefined' && buttonSelect != null) {
          for (var i = 0, len = buttonSelect.length; i < len; i++) {
            if (buttonSelect[i]) {
              buttonSelect[i].addEventListener(
                'click',
                function () {
                  useDropdown.displayUl(this)
                },
                false
              )
            }
          }
          useDropdown.InitializeSearch()
        }
      }
      useDropdown.resetDropdown()
    },
  }

  WRAF_NS.Site.initializeDropdown()
})(window.jQuery)
