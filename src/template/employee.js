import { PREFIX } from '../config'

const POST_TYPE = 'employees'
const TERM = 'employees_category'

const renderFilterResult = (response) => {
  let resultFilter = document.getElementById(
    PREFIX + '-result-' + POST_TYPE + '-' + TERM
  )
  const resultLabel = document.getElementsByClassName('wraf-result-wrapper')[0]
    ? document
        .getElementsByClassName('wraf-result-wrapper')[0]
        .getAttribute('data-label')
    : 'Search results'
  if (response) {
    response.sort(function (a, b) {
      return a.employees_order - b.employees_order
    })
    var output =
      '<h2>' +
      resultLabel +
      '</h2><div class="mk-employees jupiter-donut-margin-bottom-10 jupiter-donut-margin-top-10 three-column u6col u5col u4col o0col o1col o2col simple c_cs  jupiter-donut-"><ul>'
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
  }
}

export default {
  renderFilterResult,
}
