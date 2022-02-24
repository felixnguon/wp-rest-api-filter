import { PREFIX } from '../config'

const POST_TYPE = 'posts'

const renderFilterResult = (response) => {
  let resultFilter = document.getElementById(PREFIX + '-result-' + POST_TYPE),
    categories = resultFilter.getAttribute('categories')
  if (response) {
    const resultLabel = document.getElementsByClassName(
      'wraf-result-wrapper'
    )[0]
      ? document
          .getElementsByClassName('wraf-result-wrapper')[0]
          .getAttribute('data-label')
      : 'Search results'
    if (
      categories == 'news' ||
      categories == 'legal-updates' ||
      categories == 'webinars' ||
      categories == 'news-vi' ||
      categories == 'legal-updates-vi' ||
      categories == 'webinars-vi'
    ) {
      let output =
        '<h2>' +
        resultLabel +
        '</h2><div class=""><ul class="js-loop js-el jupiter-donut-clearfix mk-blog-container mk-grid-wrapper jupiter-donut- mag-one-column mk-blog-container-lazyload js-loop--loaded">'
      $j.each(response, function (index, object) {
        output +=
          '<li class="mk-blog-grid-item mk-isotop-item image-post-type two-column mk-blog-grid-item--loaded">'
        output += '<div class="blog-grid-holder">'
        output += '<div class="mk-blog-meta">'
        output +=
          '<h3 class="the-title"><a href="' +
          object.link +
          '">' +
          object.title.rendered +
          '</a></h3>'

        let date = new Date(object.date)
        output +=
          '<div class="mk-blog-meta-wrapper"><time><a href="https://ykvn-law.lndo.site/2020/06/">' +
          date.toLocaleString('default', { month: 'long' }) +
          ' ' +
          date.getDate() +
          ', ' +
          date.getFullYear() +
          '</a></time></div>'

        output +=
          '<div class="the-excerpt">' + object.excerpt.rendered + '</div>'

        output += '</div></li>'
      })
      output += '</ul></div>'
      if (output.length) {
        if (typeof resultFilter != 'undefined' && resultFilter != null) {
          //Remove all child elements of a DOM node
          while (resultFilter.firstChild) {
            resultFilter.removeChild(resultFilter.firstChild)
          }
        }
        $j('.mk-blog-container').empty()
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
    } else {
      let output =
        '<h2>' +
        resultLabel +
        '</h2><div class=""><ul class="mk-blog-container mk-thumbnail-wrapper   jupiter-donut- mag-one-column">'
      $j.each(response, function (index, object) {
        output +=
          '<li class="mk-blog-thumbnail-item image-post-type mk-isotop-item image-post-type content-align-right  jupiter-donut-clearfix">'
        output += '<div class="item-holder">'
        output += '<div class="featured-image">'
        if (object.feature_image_src) {
          output +=
            '<a href="' +
            object.link +
            '"><img alt="' +
            object.title.rendered +
            '" title="' +
            object.title.rendered +
            '" src="' +
            object.feature_image_src +
            '" /> </a>'
        }
        output += '</div>'
        output +=
          '<div class="item-wrapper" itemscope="itemscope" itemtype="https://schema.org/Post"><div class="mk-blog-meta">'
        let date = new Date(object.date)
        output +=
          '<div class="mk-blog-meta-wrapper"><time datetime="2020-06-25"><a href="https://ykvn-law.lndo.site/2020/06/">' +
          date.toLocaleString('default', { month: 'long' }) +
          ' ' +
          date.getDate() +
          ', ' +
          date.getFullYear() +
          '</a></time></div>'
        output +=
          '<h3 class="the-title"><a href="' +
          object.link +
          '">' +
          object.title.rendered +
          '</a></h3>'
        output += '</div>'
        output +=
          '<div class="the-excerpt">' + object.excerpt.rendered + '</div>'
        output += '<div class="mk-teader-button">'
        output +=
          '<div class="mk-teader-button"><div class="mk-button-container _ jupiter-donut-relative    jupiter-donut-inline-block jupiter-donut-left "><a href="' +
          object.link +
          '" target="_self" class="mk-button js-smooth-scroll mk-button--dimension-outline mk-button--size-medium mk-button--corner-pointed skin-dark _ jupiter-donut-relative jupiter-donut-text-center jupiter-donut-font-weight-700 jupiter-donut-no-backface  letter-spacing-1 jupiter-donut-inline-block"><span class="mk-button--text">READ MORE</span></a></div></div>'

        output += '</div></li>'
      })
      output += '</ul></div>'
      if (output.length) {
        if (typeof resultFilter != 'undefined' && resultFilter != null) {
          //Remove all child elements of a DOM node
          while (resultFilter.firstChild) {
            resultFilter.removeChild(resultFilter.firstChild)
          }
        }
        $j('.mk-blog-container').empty()
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
}

export default {
  renderFilterResult,
}
