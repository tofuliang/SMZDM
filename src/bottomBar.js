var bottomBar = {
    init: function () {
        var webUrl = this.isShow();
        if (!webUrl) {
            return false
        }
        this.inserCss("bottomBar.css");
        this.inserHtml();
        this.inserActive();
        this.getHtml(webUrl)
    },
    inserHtml: function () {
        var wrapBox = document.createElement("div");
        wrapBox.id = "smzdmBottomBar";
        var bottomHtml = [];
        bottomHtml.push('<div class="containerBar">');
        bottomHtml.push('<img id="bottomBarLogo" src="' + chrome.extension.getURL("icons/bottomIcon.png") + '" />');
        bottomHtml.push('<div class="sortMenu" id="goodsBox">');
        bottomHtml.push('<div class="sortTitle">');
        bottomHtml.push("相关商品");
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="relevantListBox">');
        bottomHtml.push('<div class="resultTitle">');
        bottomHtml.push('什么值得买为您筛选出相关商品总共<span class="c_red"></span>条');
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="listload">加载中...</div>');
        bottomHtml.push("</div>");
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="sortMenu" id="articleBox">');
        bottomHtml.push('<div class="sortTitle">');
        bottomHtml.push("相关文章");
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="relevantListBox">');
        bottomHtml.push('<div class="resultTitle">');
        bottomHtml.push('什么值得买为您筛选出相关文章总共<span class="c_red"></span>条');
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="listload">加载中...</div>');
        bottomHtml.push("</div>");
        bottomHtml.push("</div>");
        bottomHtml.push("</div>");
        bottomHtml.push('<div class="switchBtn smzdm_on"></div>');
        var HTML = bottomHtml.join("");
        wrapBox.innerHTML = HTML;
        $("body").append(wrapBox)
    },
    inserCss: function (cssPath) {
        var url = chrome.extension.getURL("css/" + cssPath);
        try {
            document.createStyleSheet(url)
        } catch (e) {
            var cssLink = document.createElement("link");
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            cssLink.href = url;
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(cssLink)
        }
    },
    inserActive: function () {
        var that = this;
        var status = function (my, active, display) {
            $(my)[active]("sortTitleHover");
            $(my).next(".relevantListBox")[display]()
        };

        function inserGoods(empty) {
            $(".listload").remove();
            if (empty == "empty") {
                var relevantGoodsDom = document.createElement("ul");
                relevantGoodsDom.className = "resultList";
                relevantGoodsDom.innerHTML = '<div class="empty">暂无</div>';
                $("#goodsBox .resultTitle").after(relevantGoodsDom);
                return false
            }
            var relevantGoodsDom = document.createElement("ul");
            relevantGoodsDom.className = "resultList";
            var relevantAGoodsList = [];
            relevantAGoodsList.push('<li :data-url="goods.link" v-for="goods in goodslist">');
            relevantAGoodsList.push('<div class="listImg">');
            relevantAGoodsList.push('<img :src="goods.pic_url" />');
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push('<div class="mainTxt">');
            relevantAGoodsList.push('<div class="listTitle">');
            relevantAGoodsList.push('<span class="sortLabel" :style="{background:goods.sortColor}" >{{ goods.sort }}</span>');
            relevantAGoodsList.push("{{ goods.title }}");
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push('<div class="attributeBox">');
            relevantAGoodsList.push('<div class="l_price">');
            relevantAGoodsList.push("{{ goods.price }}");
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push('<div class="r_zhi">');
            relevantAGoodsList.push('<span class="zhi_top">{{ goods.zhi }}</span><span class="zhi_bottom">{{ goods.buzhi }}</span>');
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push("</div>");
            relevantAGoodsList.push("</li>");
            var lastListHtml = relevantAGoodsList.join("");
            relevantGoodsDom.innerHTML = lastListHtml;
            $("#goodsBox .resultTitle").after(relevantGoodsDom)
        }

        function inserArticle(empty) {
            $(".listload").remove();
            if (empty == "empty") {
                var relevantArticleDom = document.createElement("ul");
                relevantArticleDom.className = "resultList";
                relevantArticleDom.innerHTML = '<div class="empty">暂无</div>';
                $("#articleBox .resultTitle").after(relevantArticleDom);
                return false
            }
            var relevantArticleDom = document.createElement("ul");
            relevantArticleDom.className = "resultList";
            var relevantArticleList = [];
            relevantArticleList.push('<li :data-url="article.link" v-for="article in articlelist">');
            relevantArticleList.push('<div class="listImg">');
            relevantArticleList.push('<img :src="article.pic_url"/>');
            relevantArticleList.push("</div>");
            relevantArticleList.push('<div class="mainTxt">');
            relevantArticleList.push('<div class="listTitle">');
            relevantArticleList.push('<span class="sortLabel" :style="{background:article.sortColor}">{{ article.sort }}</span>');
            relevantArticleList.push("{{ article.title }}");
            relevantArticleList.push("</div>");
            relevantArticleList.push('<div class="attributeBox">');
            relevantArticleList.push('<div class="explain_text">');
            relevantArticleList.push("{{ article.explain }}");
            relevantArticleList.push("</div>");
            relevantArticleList.push("</div>");
            relevantArticleList.push("</div>");
            relevantArticleList.push("</li>");
            var lastListHtml = relevantArticleList.join("");
            relevantArticleDom.innerHTML = lastListHtml;
            $("#articleBox .resultTitle").after(relevantArticleDom)
        }

        $("body").on("mouseover", ".sortTitle", function () {
            status(this, "addClass", "show");
            if (!!$(this).parent().find(".resultList")[0]) {
                return false
            }
            if ($(this).parent().attr("id") == "goodsBox") {
                var listData = that.getData("youhui,haitao,faxian");
                if (listData != "") {
                    inserGoods();
                    $("#goodsBox .resultTitle span").html(" " + listData.length + " ")
                } else {
                    inserGoods("empty");
                    $("#goodsBox .resultTitle span").html(" 0 ");
                    return false
                }
                new Vue({el: "#goodsBox", data: {goodslist: listData}})
            } else {
                var listData = that.getData("yuanchuang,news,zhongce");
                if (listData != "") {
                    inserArticle();
                    $("#articleBox .resultTitle span").html(" " + listData.length + " ")
                } else {
                    inserArticle("empty");
                    $("#articleBox .resultTitle span").html(" 0 ");
                    return false
                }
                new Vue({el: "#articleBox", data: {articlelist: listData}})
            }
        });
        $("body").on("mouseout", ".sortTitle", function () {
            status(this, "removeClass", "hide")
        });
        var statusBox = function (my, active, display) {
            $(my).prev(".sortTitle")[active]("sortTitleHover");
            $(my)[display]()
        };
        $("body").on("mouseover", ".relevantListBox", function () {
            statusBox(this, "addClass", "show")
        });
        $("body").on("mouseout", ".relevantListBox", function () {
            statusBox(this, "removeClass", "hide")
        });
        $("body").on("mouseover", ".relevantListBox li", function () {
            $(".relevantListBox li").css("border-bottom", "1px #e6e6e6 dashed");
            $(this).css("border-bottom", "1px #666 dashed")
        });
        $("body").on("click", ".relevantListBox li", function () {
            window.open($(this).data("url"))
        });
        $(".switchBtn").click(function () {
            if ($(this).hasClass("smzdm_on")) {
                $(this).attr("class", "switchBtn smzdm_off");
                $(".containerBar").addClass("smzdm_off");
                $(".relevantListBox").hide()
            } else {
                $(this).attr("class", "switchBtn smzdm_on");
                $(".containerBar").removeClass("smzdm_off")
            }
        })
    },
    isShow: function () {
        var that = this;
        var urlOption = {};
        var cacheUrl = localStorage.getItem("cacheUrl");
        if (cacheUrl) {
            urlOption = JSON.parse(cacheUrl)
        } else {
            $.ajaxSetup({async: false});
            $.post(that.apiAddress.webMatching, function (data) {
                var data = data.data.DetailPageInfoTagConfigs;
                if (!!data) {
                    urlOption = data;
                    localStorage.setItem("cacheUrl", JSON.stringify(data))
                } else {
                    console.warn("没有获取到网址配置")
                }
            });
            $.ajaxSetup({async: true})
        }
        for (var a in urlOption) {
            var urlReg = new RegExp(a);
            if (urlReg.test(window.location.href)) {
                return urlOption[a]
            }
        }
        return null
    },
    getData: function (sortOption) {
        var that = this;
        var dataVal = [];
        var option = {
            request_from: "值得买小助手",
            keyword: $("meta[name='keywords']").attr("content"),
            article_type: sortOption
        };
        $.ajaxSetup({async: false});
        $.post(that.apiAddress.relevantMessage, option, function (data) {
            dataVal = data.data
        });
        $.ajaxSetup({async: true});
        if (dataVal.length == 0) {
            return ""
        } else {
            var array = [];
            if (sortOption == "youhui,haitao,faxian") {
                for (var i = 0; i < dataVal.length; i++) {
                    array[i] = {};
                    array[i].sort = dataVal[i].article_type;
                    switch (array[i].sort) {
                        case"youhui":
                            array[i].sort = "优惠";
                            array[i].sortColor = "#ee474e";
                            break;
                        case"haitao":
                            array[i].sort = "海淘";
                            array[i].sortColor = "#fec52d";
                            break;
                        case"faxian":
                            array[i].sort = "发现";
                            array[i].sortColor = "#ff5400";
                            break
                    }
                    array[i].title = dataVal[i].title;
                    array[i].link = dataVal[i].article_url + "?utm_source=chrome&utm_medium=Push&utm_campaign=relevant&utm_Content= ";
                    array[i].price = dataVal[i].subtitle ? dataVal[i].subtitle : "暂无价格";
                    array[i].pic_url = dataVal[i].focus_pic_url;
                    array[i].zhi = dataVal[i].worthy_count;
                    array[i].buzhi = dataVal[i].unworthy_count
                }
            } else {
                for (var i = 0; i < dataVal.length; i++) {
                    array[i] = {};
                    array[i].sort = dataVal[i].article_type;
                    switch (array[i].sort) {
                        case"yuanchuang":
                            array[i].sort = "原创";
                            array[i].sortColor = "#42a8ea";
                            break;
                        case"news":
                            array[i].sort = "资讯";
                            array[i].sortColor = "#5dad4a";
                            break;
                        case"zhongce":
                            array[i].sort = "众测";
                            array[i].sortColor = "#8182f8";
                            break
                    }
                    array[i].title = dataVal[i].title;
                    array[i].link = dataVal[i].article_url + "?utm_source=chrome&utm_medium=Push&utm_campaign=relevant&utm_Content= ";
                    array[i].pic_url = dataVal[i].focus_pic_url;
                    array[i].explain = dataVal[i].content.replace(/<\/?[^>]*>/g, "").replace(/&nbsp;/g, "");
                    if (array[i].explain == "") {
                        array[i].explain = "暂无简介"
                    }
                }
            }
            return array
        }
    },
    apiAddress: {
        relevantMessage: "https://api.smzdm.com/chrome/get_product_info",
        webMatching: "https://api.smzdm.com/chrome/get_web_config",
        statistics: "https://api.smzdm.com/chrome/save_product_html"
    },
    getHtml: function (element) {
        var that = this;

        function subSomething() {
            if (document.readyState == "complete") {
                if ($(element)[0]) {
                    var locationHref = window.location.href.length > 100 ? window.location.href.substr(0, 100) : window.location.href;
                    var pattern = new RegExp("[`~!@#$^&*()=|{}':;'.]");
                    locationHref = locationHref.replace(pattern, "");
                    chrome.extension.sendMessage({cacheUrl: locationHref});
                    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
                        if (request.decision === "true") {
                            var optionHtml = $(element).html().toString();
                            var option = {url: window.location.href, html: optionHtml};
                            $.post(that.apiAddress.statistics, option, function () {
                            })
                        }
                    })
                }
            }
        }

        document.onreadystatechange = subSomething
    }
};
window.onload = function () {
    bottomBar.init()
};