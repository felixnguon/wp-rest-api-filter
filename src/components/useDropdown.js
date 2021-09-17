import { PREFIX } from '../config'
// import jQuery from 'jquery'
window.$j = window.jQuery = jQuery
var $j = jQuery.noConflict()

const useDropdown = (select, select_i) => {
  let dropDownDiv = document.createElement('div')
  select.parentNode.insertBefore(dropDownDiv, select)
  dropDownDiv.appendChild(select)

  var dropDownButton = document.createElement('button'),
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
    select_i
  dropDownButton.setAttribute('data-value', '')
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

  for (var i = 0; i < select.options.length; i++) {
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
  var searchButton = document.getElementsByClassName('wraf-submit')
  if (searchButton.item(0)) {
    $j(document).on('keydown', 'form', function (event) {
      return event.key != 'Enter'
    })
    searchButton.item(0).addEventListener(
      'click',
      function (event) {
        event.preventDefault()
        event.stopPropagation()
        var preloader =
          '<div class="ball-pulse"><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div><div style="background-color: #223c7e"></div></div>'
        var postTypeFilter = this.getAttribute('data-posttype'),
          termFilter = this.parentNode
            .getElementsByClassName('search-field')
            .item(0).value,
          resultFilter = document.getElementById(
            PREFIX + '-result-' + postTypeFilter + '-' + 'employees_category'
          ),
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

        var jsonURL = wraf_ajax_filter_params.json_url
        if (typeof postTypeFilter != 'undefined' && postTypeFilter != null) {
          jsonURL += postTypeFilter
          if (termFilter != null) {
            jsonURL += '?search=' + termFilter + '&per_page=100'
          }
        }

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
            response.sort(function (a, b) {
              return a.employees_order - b.employees_order
            })
            var output =
              '<h2>Search results</h2><div class="mk-employees jupiter-donut-margin-bottom-10 jupiter-donut-margin-top-10 three-column u6col u5col u4col o0col o1col o2col simple c_cs  jupiter-donut-"><ul>'
            $j.each(response, function (index, object) {
              output +=
                '<li class="mk-employee-item jupiter-donut-colitem jupiter-donut-align-center jupiter-donut-display-inline-block jupiter-donut-float-left">'
              output += '<div class="item-holder">'

              output +=
                '<div class="team-thumbnail jupiter-donut-position-relative jupiter-donut-width-100-per jupiter-donut-height-100-per jupiter-donut-overflow-hidden rounded-false"><a href="' +
                object.link +
                '"><img alt="' +
                object.title.rendered +
                '" title="' +
                object.title.rendered +
                '" src="' +
                object.employees_image_src +
                '" /> </a></div>'

              output +=
                '<div class="team-info-wrapper" itemscope="itemscope" itemtype="https://schema.org/Person">'
              output +=
                '<a class="team-member-name" href="' +
                object.link +
                '"> <span class="team-member-name jupiter-donut-font-16 jupiter-donut-display-block jupiter-donut-font-weight-bold jupiter-donut-text-transform-up jupiter-donut-color-333">' +
                object.title.rendered +
                '</span> </a>'
              output +=
                '<span class="team-member-position jupiter-donut-font-12 jupiter-donut-text-transform-up jupiter-donut-display-block jupiter-donut-color-777 jupiter-donut-letter-spacing-1">' +
                object.employees_position +
                '</span>'

              output +=
                '<div class="team-member-desc jupiter-donut-margin-top-20 jupiter-donut-margin-bottom-10 jupiter-donut-display-block"><p>' +
                object.employees_desc +
                '</p></div>'

              output += '</li>'
            })
            output += '</ul></div>'
            // console.log(response);
            if (output.length) {
              //Remove all child elements of a DOM node
              if (typeof resultFilter != 'undefined' && resultFilter != null) {
                //Remove all child elements of a DOM node
                while (resultFilter.firstChild) {
                  resultFilter.removeChild(resultFilter.firstChild)
                }
              }
              $j(resultFilter).append(output)
              $j(resultFilter).removeClass('loading')
              if ($j(window).width() < 640) {
                $j('html, body').animate(
                  {
                    scrollTop: $j(resultFilter).offset().top,
                  },
                  1000
                )
              }
            }
          })
          .fail(function (response) {
            console.log("Something went wront, can't fetch")
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
    var selectDropdown = element.parentNode.getElementsByTagName('ul')

    if (typeof selectDropdown != 'undefined' && selectDropdown != null) {
      selectDropdown[0].classList.add('current')
      //Close all the dropdown first
      var selectDropdowns = document.querySelectorAll(
        '.wraf-dropdown__list:not(.current)'
      )
      if (selectDropdowns) {
        for (var i = 0, len = selectDropdowns.length; i < len; i++) {
          selectDropdowns[i].classList.remove('active')
        }
      }
      selectDropdown[0].classList.remove('current')

      for (var i = 0, len = selectDropdown.length; i < len; i++) {
        selectDropdown[0].classList.toggle('active')
        element.classList.toggle('active')
      }
    }
  } else if (element.tagName == 'LI') {
    var selectId =
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
  var element = document.getElementById(id)
  element.value = valueToSelect
  element.setAttribute('selected', 'selected')
}

const resetDropdown = () => {
  var resetBtn = document.getElementsByClassName('wraf-dropdown-reset')[0]
  if (typeof resetBtn != 'undefined' && resetBtn != null) {
    var postTypeFilter = resetBtn.getAttribute('data-posttype'),
      termFilter = resetBtn.getAttribute('data-taxonomy'),
      resultFilter = document.getElementById(
        PREFIX + '-result-' + postTypeFilter + '-' + termFilter
      )

    resetBtn.addEventListener('click', function (event) {
      event.preventDefault()
      if (typeof resultFilter != 'undefined' && resultFilter != null) {
        console.log('result-test 1')
        //Remove all child elements of a DOM node
        while (resultFilter.firstChild) {
          resultFilter.removeChild(resultFilter.firstChild)
        }
      }
      var dropdowns = document.getElementsByClassName('wraf-dropdown')
      if (typeof dropdowns != 'undefined' && dropdowns != null) {
        Array.from(dropdowns).forEach(function (item, index) {
          var dropDownLabel = item
            .getElementsByTagName('select')[0]
            .getAttribute('data-label')
          var dropDownButton = item.getElementsByTagName('button')[0]
          dropDownButton.classList.remove('active')
          var span = dropDownButton.getElementsByTagName('span')[0]
          span.textContent = dropDownLabel
          span.parentNode.setAttribute('data-value', '')
        })
      }
    })
  }
}

const filter = (element) => {
  var select = element.parentNode.parentNode
    .getElementsByTagName('select')
    .item(0)

  if (select) {
    var $jthis = element,
      postTypeFilter = select.getAttribute('data-posttype'),
      termFilter = select.getAttribute('data-taxonomy'),
      termIDFilter = element.getAttribute('data-value'),
      resultFilter = document.getElementById(
        PREFIX + '-result-' + postTypeFilter + '-' + termFilter
      ),
      layout = select.classList.contains('list') ? 'list' : 'grid',
      perPage = 100,
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
    var termArrayFilter = []
    var termArrayFilterElement = document.getElementsByClassName(
      PREFIX + '-dropdown__button'
    )

    var jsonURL = buildJsonFilterURL(postTypeFilter, termFilter, perPage)

    var isAndOperator = false
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
    jsonURL += '&per_page=100'

    $j.ajax({
      dataType: 'json',
      url: jsonURL,
      beforeSend: function (xhr) {
        // Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
        xhr.setRequestHeader('X-WP-Nonce', wraf_ajax_filter_params.ajax_nonce)
      },
    })
      .done(function (response) {
        response.sort(function (a, b) {
          return a.employees_order - b.employees_order
        })

        var output =
          '<h2>Search results</h2><div class="mk-employees jupiter-donut-margin-bottom-10 jupiter-donut-margin-top-10 three-column u6col u5col u4col o0col o1col o2col simple c_cs  jupiter-donut-"><ul>'
        $j.each(response, function (index, object) {
          output +=
            '<li class="mk-employee-item jupiter-donut-colitem jupiter-donut-align-center jupiter-donut-display-inline-block jupiter-donut-float-left">'
          output += '<div class="item-holder">'

          output +=
            '<div class="team-thumbnail jupiter-donut-position-relative jupiter-donut-width-100-per jupiter-donut-height-100-per jupiter-donut-overflow-hidden rounded-false"><a href="' +
            object.link +
            '"><img alt="' +
            object.title.rendered +
            '" title="' +
            object.title.rendered +
            '" src="' +
            object.employees_image_src +
            '" /> </a></div>'

          output +=
            '<div class="team-info-wrapper" itemscope="itemscope" itemtype="https://schema.org/Person">'
          output +=
            '<a class="team-member-name" href="' +
            object.link +
            '"> <span class="team-member-name jupiter-donut-font-16 jupiter-donut-display-block jupiter-donut-font-weight-bold jupiter-donut-text-transform-up jupiter-donut-color-333">' +
            object.title.rendered +
            '</span> </a>'
          output +=
            '<span class="team-member-position jupiter-donut-font-12 jupiter-donut-text-transform-up jupiter-donut-display-block jupiter-donut-color-777 jupiter-donut-letter-spacing-1">' +
            object.employees_position +
            '</span>'

          output +=
            '<div class="team-member-desc jupiter-donut-margin-top-20 jupiter-donut-margin-bottom-10 jupiter-donut-display-block"><p>' +
            object.employees_desc +
            '</p></div>'

          output += '</li>'
          //console.log("index", index);
          // console.log("object", object.title.rendered);
        })
        output += '</ul></div>'
        //console.log(response);
        if (output.length) {
          if (typeof resultFilter != 'undefined' && resultFilter != null) {
            //Remove all child elements of a DOM node
            while (resultFilter.firstChild) {
              resultFilter.removeChild(resultFilter.firstChild)
            }
          }
          $j(resultFilter).append(output)
          $j(resultFilter).removeClass('loading')
          if ($j(window).width() < 640) {
            $j('html, body').animate(
              {
                scrollTop: $j(resultFilter).offset().top,
              },
              1000
            )
          }
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

const buildJsonFilterURL = (postType, term, perPage) => {
  if (postType == 'post') {
    postType = 'posts'
    if (term == 'category') {
      term = 'categories'
    }
  }

  let jsonUrl = wraf_ajax_filter_params.json_url
  if (typeof postType != 'undefined' && postType != null) {
    jsonUrl += postType
    if (typeof term != 'undefined' && term != null) {
      jsonUrl += '?filter[' + term + ']='
    }
    // if (typeof perPage != "undefined" && perPage != null) {
    //   jsonUrl += "&per_page=" + perPage;
    // }
    // jsonUrl += "&_embed";
  }
  return jsonUrl
}

// filterByDropdown: function(e) {
//   // var $jthis = $j(this),
//   //   termFilter = $jthis.find(".term-filter"),
//   //   recentTuts = $jthis.find(".recent-tuts"),
//   //   layout = recentTuts.hasClass("grid") ? "grid" : "list",
//   //   perPage = termFilter.data("per-page"),
//   //   requestRunning = false;

//   console.log();

//   // $j.ajax({
//   //   type: "POST",
//   //   url: wraf_ajax_filter_params.ajax_url,
//   //   dataType: "json",
//   //   data: {
//   //     action: "filter_post_by_taxonomy_ajax"
//   //   },
//   //   success: function(result) {
//   //     alert(result.success ? "success" : "Error: " + result.message);
//   //   }
//   // });
// }

export default {
  useDropdown,
  displayUl,
  selectElement,
  filter,
  buildJsonFilterURL,
  InitializeSearch,
  resetDropdown,
}
