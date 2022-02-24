import { PREFIX } from '../config'
import employee from '../template/employee'
import post from '../template/post'

// import jQuery from 'jquery'
window.$j = window.jQuery = jQuery
let $j = jQuery.noConflict()

const onChangeDatePickerField = (date, str, inst) => {
  if (date.length) {
    let after = new Date(date),
      before = new Date(after),
      datepickerField = document
        .getElementsByClassName('wraf-datepicker')
        .item(0),
      typeFilter = datepickerField.getAttribute('data-type-filter'),
      jsonURL = getDropdownFilterJson(datepickerField)

    before.setDate(before.getDate() + 1)

    datepickerField.setAttribute('data-before', before.toISOString())
    datepickerField.setAttribute('data-after', after.toISOString())

    jsonURL += '&' + 'after=' + after.toISOString()

    $j.ajax({
      dataType: 'json',
      url: jsonURL,
      beforeSend: function (xhr) {
        // Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
        xhr.setRequestHeader('X-WP-Nonce', wraf_ajax_filter_params.ajax_nonce)
      },
    })
      .done(function (response) {
        if (typeFilter == 'taxanomy') {
          employee.renderFilterResult(response)
        } else if (typeFilter == 'meta') {
          post.renderFilterResult(response)
        }
      })
      .fail(function (response) {
        console.log("Something went wrong, can't fetch")
      })
      .always(function (response) {
        // 11. Always reset the requestRunning to keep sending new AJAX requests
        requestRunning = false
      })
  }
}

const getDropdownFilterJson = (element) => {
  let jsonURL = wraf_ajax_filter_params.json_url
  let dropdowns = document.querySelectorAll('.wraf-dropdown__button.active')
  jsonURL += 'posts' + '?'
  if (dropdowns.length) {
    let postTypeFilter = element.getAttribute('data-posttype'),
      termFilter = element.getAttribute('data-taxonomy'),
      resultFilter = document.getElementById(
        [PREFIX, 'result', postTypeFilter, termFilter].filter(Boolean).join('-')
      ),
      preloader =
        '<div class="ball-pulse"><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div></div>',
      requestRunning = false

    if (requestRunning) {
      return
    }
    requestRunning = true

    if (typeof resultFilter != 'undefined' && resultFilter != null) {
      //Remove all child elements of a DOM node
      while (resultFilter.firstChild) {
        resultFilter.removeChild(resultFilter.firstChild)
      }
      //Add loading class
      resultFilter.classList.add('loading')
      $j(resultFilter).append(preloader)
    }

    Array.from(dropdowns, (dropdown) => {
      if (dropdown.getAttribute('data-value') != '') {
        jsonURL +=
          '&' +
          dropdown.getAttribute('data-term') +
          '=' +
          dropdown.getAttribute('data-value')
      }
    })
  }
  return jsonURL
}

export default {
  onChangeDatePickerField,
}
