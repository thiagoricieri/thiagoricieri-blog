const { okHtml, notFound, basicInfoAnd } = require('../utils/html')
    , { loadHtml, loadMeta, tableOfContents } = require('../utils/dist')
    , { convertDate } = require('../utils/misc')

module.exports = function (app){

  // GET /:blog-url
  app.get("/:blogUrl", function(httpReq, httpRes, next) {
    var url = httpReq.params.blogUrl
    var html = loadHtml(url)
    var meta = loadMeta(url)

    if (!html) {
      notFound(httpRes).send('¯\\_(ツ)_/¯')
      return
    }

    meta.postTitle = meta.title
    meta.title = `${meta.title} | thiago ricieri blog`
    meta.layout = meta.layout || 'post'
    meta.humanDate = convertDate(meta.date)
    meta.html = html
    meta.hasApp = (meta.app != undefined && meta.app != null)

    meta.pageTitle = meta.postTitle
    meta.pageDescription = meta.description || meta.postTitle

    if (meta.author) meta.pageAuthor = meta.author
    if (meta.featured) meta.pageImage = meta.featured

    var type = meta.type || 'post'
    okHtml(httpRes).render(`pages/${type}`, basicInfoAnd(meta))
  })

  // GET /:blog-url/app
  app.get("/:blogUrl/app", function(httpReq, httpRes, next) {
    var url = httpReq.params.blogUrl
    var meta = loadMeta(url)

    if (!meta) {
      notFound(httpRes).send('¯\\_(ツ)_/¯')
      return
    }

    if (!meta.app) {
      httpRes.redirect(401, `/${url}`)
      return
    }

    okHtml(httpRes).send(meta.app)
  })
}
