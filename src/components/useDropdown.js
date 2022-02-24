import { PREFIX } from '../config'
import employee from '../template/employee'
import post from '../template/post'

// import jQuery from 'jquery'
window.$j = window.jQuery = jQuery
let $j = jQuery.noConflict()

const useDropdown = (select, select_i) => {
  let dropDownDiv = document.createElement('div')
  select.parentNode.insertBefore(dropDownDiv, select)
  dropDownDiv.appendChild(select)

  let dropDownButton = document.createElement('button'),
    dropDownLabel = document.createElement('span'),
    labelText = document.createTextNode(select.getAttribute('data-label')),
    dropDownArrow = document.createElement('i'),
    dropDownList = document.createElement('ul')
  dropDownDiv.className = PREFIX + '-dropdown select-dropdown--' + select_i
  dropDownButton.className =
    PREFIX +
    '-dropdown__button' +
    ' ' +
    PREFIX +
    '-dropdown__button--' +
    select_i +
    ' ' +
    select.getAttribute('data-posttype')

  dropDownButton.setAttribute('data-value', '')
  dropDownButton.setAttribute('data-term', select.getAttribute('data-term'))

  dropDownLabel.className =
    PREFIX + '-dropdown__label' + ' ' + PREFIX + '-dropdown__label--' + select_i
  dropDownArrow.className = 'chevron-down'
  dropDownList.className =
    PREFIX + '-dropdown__list' + ' ' + PREFIX + '-dropdown__list--' + select_i
  dropDownList.id = PREFIX + '-dropdown__list'

  dropDownDiv.appendChild(dropDownButton)
  dropDownLabel.appendChild(labelText)
  dropDownButton.appendChild(dropDownLabel)
  dropDownButton.appendChild(dropDownArrow)
  dropDownDiv.appendChild(dropDownList)

  for (let i = 0; i < select.options.length; i++) {
    let dropDownItem = document.createElement('li'),
      optionValue = select.options[i].value,
      optionText = document.createTextNode(select.options[i].text)
    dropDownItem.className = PREFIX + '-dropdown__list-item'
    dropDownItem.setAttribute('data-value', optionValue)
    dropDownItem.appendChild(optionText)
    dropDownList.appendChild(dropDownItem)

    dropDownItem.addEventListener(
      'click',
      function () {
        displayUl(this)
        filter(this)
      },
      false
    )
  }
}

const InitializeSearch = () => {
  let searchButton = document.getElementsByClassName('wraf-submit').item(0)
  if (searchButton) {
    $j(document).on('keydown', 'form', function (event) {
      return event.key != 'Enter'
    })
    searchButton.addEventListener(
      'click',
      function (event) {
        event.preventDefault()
        event.stopPropagation()
        let preloader =
          '<div class="ball-pulse"><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div></div>'
        let postTypeFilter = this.getAttribute('data-posttype'),
          searchFilter = this.parentNode
            .getElementsByClassName('search-field')
            .item(0).value,
          termFilter = searchButton.getAttribute('data-taxonomy'),
          typeFilter = searchButton.getAttribute('data-type-filter'),
          resultFilter = document.getElementById(
            [PREFIX, 'result', postTypeFilter, termFilter]
              .filter(Boolean)
              .join('-')
          ),
          fields = [],
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
        if (
          postTypeFilter == 'posts' &&
          searchButton.getAttribute('data-categories')
        ) {
          fields.push({
            categories: searchButton.getAttribute('data-categories'),
          })
        }
        let jsonURL = buildJsonSearchURL(
          postTypeFilter,
          typeFilter,
          searchFilter,
          fields
        )

        $j.ajax({
          dataType: 'json',
          url: jsonURL,
          beforeSend: function (xhr) {
            // Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
            xhr.setRequestHeader(
              'X-WP-Nonce',
              wraf_ajax_filter_params.ajax_nonce
            )
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
      },
      false
    )
  }
}

const displayUl = (element) => {
  if (element.tagName == 'BUTTON') {
    let selectDropdown = element.parentNode.getElementsByTagName('ul')

    if (typeof selectDropdown != 'undefined' && selectDropdown != null) {
      selectDropdown[0].classList.add('current')
      //Close all the dropdown first
      let selectDropdowns = document.querySelectorAll(
        '.wraf-dropdown__list:not(.current)'
      )
      if (selectDropdowns) {
        for (let i = 0, len = selectDropdowns.length; i < len; i++) {
          selectDropdowns[i].classList.remove('active')
        }
      }
      selectDropdown[0].classList.remove('current')

      for (let i = 0, len = selectDropdown.length; i < len; i++) {
        selectDropdown[0].classList.toggle('active')
        element.classList.toggle('active')
      }
    }
  } else if (element.tagName == 'LI') {
    let selectId =
      element.parentNode.parentNode.getElementsByTagName('select')[0]
    if (typeof selectId != 'undefined' && selectId != null) {
      selectElement(selectId.id, element.getAttribute('data-value'))
    }

    let elementParentSpan =
      element.parentNode.parentNode.getElementsByTagName('span')
    if (typeof elementParentSpan != 'undefined' && elementParentSpan != null) {
      element.parentNode.classList.toggle('active')
      elementParentSpan[0].textContent = element.textContent
      elementParentSpan[0].parentNode.setAttribute(
        'data-value',
        element.getAttribute('data-value')
      )
    }
  }
}

const selectElement = (id, valueToSelect) => {
  let element = document.getElementById(id)
  element.value = valueToSelect
  element.setAttribute('selected', 'selected')
}

const resetDropdown = () => {
  let resetBtn = document.getElementsByClassName('wraf-dropdown-reset')[0]
  if (typeof resetBtn != 'undefined' && resetBtn != null) {
    let postTypeFilter = resetBtn.getAttribute('data-posttype'),
      termFilter = resetBtn.getAttribute('data-taxonomy'),
      resultFilter = document.getElementById(
        [PREFIX, 'result', postTypeFilter, termFilter].filter(Boolean).join('-')
      )

    resetBtn.addEventListener('click', function (event) {
      event.preventDefault()
      if (typeof resultFilter != 'undefined' && resultFilter != null) {
        //Remove all child elements of a DOM node
        while (resultFilter.firstChild) {
          resultFilter.removeChild(resultFilter.firstChild)
        }
      }
      let dropdowns = document.getElementsByClassName('wraf-dropdown')
      if (typeof dropdowns != 'undefined' && dropdowns != null) {
        Array.from(dropdowns).forEach(function (item, index) {
          let dropDownLabel = item
            .getElementsByTagName('select')[0]
            .getAttribute('data-label')
          let dropDownButton = item.getElementsByTagName('button')[0]
          dropDownButton.classList.remove('active')
          let span = dropDownButton.getElementsByTagName('span')[0]
          span.textContent = dropDownLabel
          span.parentNode.setAttribute('data-value', '')
        })
      }

      if (postTypeFilter == 'posts') {
        document.getElementsByClassName('search-field').item(0).value = ''
        let searchButton = document
          .getElementsByClassName('wraf-submit')
          .item(0)
        searchButton.click()
      }
    })
  }
}

const filter = (element) => {
  let select = element.parentNode.parentNode
    .getElementsByTagName('select')
    .item(0)

  if (select) {
    let $jthis = element,
      postTypeFilter = select.getAttribute('data-posttype'),
      termFilter = select.getAttribute('data-taxonomy'),
      typeFilter = select.getAttribute('data-type-filter'),
      resultFilter = document.getElementById(
        [PREFIX, 'result', postTypeFilter, termFilter].filter(Boolean).join('-')
      ),
      layout = select.classList.contains('list') ? 'list' : 'grid',
      perPage = 100,
      preloader =
        '<div class="ball-pulse"><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div></div>',
      requestRunning = false,
      fields = []

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

    let termArrayFilterElement = document.getElementsByClassName(
      PREFIX + '-dropdown__button'
    )

    if (postTypeFilter == 'posts' && select.getAttribute('data-categories')) {
      fields.push({
        categories: select.getAttribute('data-categories'),
      })
    }

    let jsonURL = buildJsonFilterURL(
      postTypeFilter,
      typeFilter,
      termFilter,
      termArrayFilterElement,
      fields
    )

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
        console.log("Something went wront, can't fetch")
      })
      .always(function (response) {
        // 11. Always reset the requestRunning to keep sending new AJAX requests
        requestRunning = false
      })
  }
}

const buildJsonFilterURL = (
  postType,
  typeFilter,
  term,
  termArrayFilterElement,
  fields = null
) => {
  if (postType == 'post') {
    postType = 'posts'
    if (term == 'category') {
      term = 'categories'
    }
  }

  let jsonURL = wraf_ajax_filter_params.json_url
  if (typeof postType != 'undefined' && postType != null) {
    jsonURL += postType + '?'
    if (typeFilter == 'taxanomy') {
      if (typeof term != 'undefined' && term != null) {
        jsonURL += 'filter[' + term + ']='
        let isAndOperator = false
        Array.from(termArrayFilterElement).forEach(function (item, index) {
          let andOperator = ''
          if (isAndOperator) {
            andOperator = '%2B'
          }
          if (item.getAttribute('data-value') != '') {
            jsonURL += andOperator + item.getAttribute('data-value')
            isAndOperator = true
          }
        })
      }
      jsonURL += '&per_page=100'
    } else if (typeFilter == 'meta') {
      Array.from(termArrayFilterElement).forEach(function (item, index) {
        if (item.getAttribute('data-value') != '') {
          let value = item.getAttribute('data-value')
          if (item.getAttribute('data-term') == 'after') {
            value = getDateRange(value)
          }
          jsonURL += '&' + item.getAttribute('data-term') + '=' + value
        }
      })

      if (fields) {
        fields.forEach(function (field) {
          Object.keys(field).forEach(function eachKey(key) {
            jsonURL += '&' + key + '=' + field[key]
          })
        })
      }
    }

    // let rangePickerDropdown = document
    //   .getElementsByClassName('wraf-rangePicker')
    //   .item(0)

    // if (rangePickerDropdown) {
    //   let before = datepickerDropdown.getAttribute('data-before'),
    //     after = datepickerDropdown.getAttribute('data-after')
    //   if (before && after) {
    //     jsonURL += '&' + 'after=' + after
    //   }
    // }

    // if (typeof perPage != "undefined" && perPage != null) {
    //   jsonURL += "&per_page=" + perPage;
    // }
  }
  return jsonURL
}

const buildJsonSearchURL = (postType, typeFilter, searchData, fields) => {
  let jsonURL = wraf_ajax_filter_params.json_url
  if (typeof postType != 'undefined' && postType != null) {
    jsonURL += postType + '?'
    if (typeFilter == 'taxanomy') {
      if (typeof searchData != 'undefined' && searchData != null) {
        jsonURL += 'search=' + searchData
      }
      jsonURL += '&per_page=100&orderby=date&order=desc'
    } else if (typeFilter == 'meta') {
      if (typeof searchData != 'undefined' && searchData != null) {
        jsonURL += 'search=' + searchData
      }
      jsonURL += '&per_page=100&orderby=date&order=desc'
    }
  }
  if (fields) {
    fields.forEach(function (field) {
      Object.keys(field).forEach(function eachKey(key) {
        jsonURL += '&' + key + '=' + field[key]
      })
    })
  }

  return jsonURL
}

const getDateRange = (value) => {
  let rangeValue = value.split('-')
  if (rangeValue.length) {
    let defaultRange = ''
    switch (rangeValue[0]) {
      case 'week':
        defaultRange = 7
        break
      case 'month':
        defaultRange = 30
        break
      case 'year':
        defaultRange = 365
        break
    }
    let date = new Date()
    let pastDate = date.getDate() - defaultRange
    date.setDate(pastDate)
    date.setHours(0, 0, 0, 0)
    return date.toISOString()
  }
}

export default {
  useDropdown,
  displayUl,
  selectElement,
  filter,
  buildJsonFilterURL,
  InitializeSearch,
  resetDropdown,
}
