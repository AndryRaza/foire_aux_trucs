// AttributedString class from https://github.com/cohitre/attributedString.js
// Modifications made to support html tags & remove span wrapper from unstyled blocks
var AttributedString = (function () {
    var aString
      , StringRange
      , RangesList
      , HtmlSerializer
      , plainStringSerializer
      , _ = {}
      , entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      };
  
    _.htmlTag = function (tag, text, attributes) {
      var attributes = _.map(attributes, function (key, value) {
        if (key === "style") {
          value = _.map(value, function (style, value) {
            return "" + style + ": " + _.escapeHtml(value);
          }).join("; ");
        }
        else if (_.isArray(value)) {
          value = value.join(" ");
        }
        return "" + key + '="' + value + '"';
      });
  
      attributes = attributes.length > 0 ?
        " " + attributes.join(" ") :
        "";
  
      return ["<" , tag, attributes, ">", _.escapeHtml(text), "</" + tag + ">"].join("");
    };
  
    _.escapeHtml = function (string) {
      return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    };
  
    _.extend = function (main, obj) {
      for (var i in obj) {
        main[i] = obj[i];
      }
    };
  
    _.isString = function (obj) {
      return Object.prototype.toString.call(obj) == '[object String]';
    }
  
    _.isObject = function (obj) {
      return obj == new Object(obj);
    };
  
    _.isArray = function (obj) {
      return Array.isArray(obj);
    };
  
    _.clone = function (obj) {
      var result = {};
  
      if (obj === undefined || obj === null || _.isString(obj) || !_.isObject(obj)) {
        return obj;
      }
      else if (_.isArray(obj)) {
        return _.map(obj.slice(), function (i, obj1) {
          return _.clone(obj1);
        });
      }
      else {
        _.each(obj, function (key, value) {
          result[key] = _.clone(value);
        });
        return result;
      }
    };
  
    _.each = function (obj, callback) {
      for (var i in obj) {
        callback.call(obj[i], i, obj[i]);
      }
    };
  
    _.map = function (obj, callback) {
      var array = [];
      _.each(obj, function (key, value) {
        array.push(callback(key, value));
      });
      return array;
    };
  
    _.eachApply = function (ranges, methodName, args) {
      _.each(ranges, function (i, obj) {
        obj[methodName].apply(obj, args);
      });
    };
  
    aString = function (text) {
      var startNode = new StringRange(text);
      return {
        filter: function (callback) {
          return new RangesList(startNode.filter([], callback));
        },
        each: function (callback) {
          startNode.each(0, callback);
          return this;
        },
        map: function (callback) {
          return startNode.map([], callback);
        },
        toArray: function () {
          return startNode.toArray([]);
        },
        range: function (a, b) {
          var start = Math.min(a, b)
            , end   = Math.max(a, b)
            , node1
            , node2;
          node1 = startNode.split(start);
          node2 = node1.split(end - start);
          return RangesList.build(node1, node2);
        },
        toHtml: function () {
          return this.map(function (i, range) {
            return range.toHtml();
          }).join("");
        },
        getText: function () {
          return this.map(function (i, range) {
            return range.text;
          }).join("");
        },
      };
    };
  
    StringRange = function (text, next) {
      this.text = text;
      this.next = next;
      this.attributes = {};
    };
  
    _.extend(StringRange.prototype, {
      each: function (index, callback) {
        callback.call(this, index, this);
        this.next && this.next.each(index + 1, callback);
      },
      map: function (array, callback) {
        array.push(callback.call(this, array.length, this));
        this.next && this.next.map(array, callback);
        return array;
      },
      filter: function (array, callback) {
        var value = callback.call(this, array.length, this);
        value && array.push(this);
        this.next && this.next.filter(array, callback);
        return array;
      },
      toArray: function (array) {
        return this.map(array, function (i, range) {
          return {
            text: this.text,
            attributes: this.attributes
          };
        });
      },
      toHtml: function () {
        // console.log(this.attributes)
        if (this.attributes && Object.keys(this.attributes).length > 0) {
          return _.htmlTag(this.tagName || "span", this.text, this.attributes);
          } else if (this.tagName) {
              return _.htmlTag(this.tagName, this.text, this.attributes);
          }
  
          return this.text;
      },
      split: function (index) {
        if (index == 0) {
          return this;
        }
        else if (index < this.text.length) {
          var newRange = new StringRange(this.text.slice(index), this.next);
          newRange.attributes = _.clone(this.attributes);
          this.next = newRange;
          this.text = this.text.slice(0, index);
          return newRange;
        }
        else {
          if (this.next) {
            return this.next.split(index - this.text.length);
          }
        }
      }
    });
  
    StringRange.prototype.css = function (name, val) {
      this.attributes.style = this.attributes.style || {};
      if (arguments.length > 1) {
        this.attributes.style[name] = val;
      }
      else if (name === Object(name)) {
        for (var key in name) {
          this.css(key, name[key]);
        }
      }
      else {
        return this.attributes.style[name];
      }
      return this;
    };
  
    StringRange.prototype.attr = function (name, val) {
      if (arguments.length > 1) {
        this.attributes[name] = val;
      }
      else if (name === Object(name)) {
        for (var key in name) {
          this.attr(key, name[key]);
        }
      }
      else {
        return this.attributes[name];
      }
      return this;
    };
  
    StringRange.prototype.tag = function(tagName) {
      this.tagName = tagName;
  
      return this;
    };
  
    StringRange.prototype.hasClass = function (className) {
      return -1 < (this.attributes.class || []).indexOf(className);
    };
  
    StringRange.prototype.addClass = function (classNames) {
      var array = this.attributes.class || [];
      _.each(classNames.split(" "), function (i, className) {
        array.indexOf(className) < 0 && array.push(className);
      });
      this.attributes.class = array;
      return this;
    };
  
    StringRange.prototype.removeClass = function (className) {
      var array = this.attributes.class || []
        , i = array.indexOf(className);
  
      i >= 0 && array.splice(i, 1);
      this.attributes.class = array;
      return this;
    };
  
    RangesList = function (ranges) {
      this.ranges = ranges;
    };
  
    RangesList.build = function (start, end) {
      var ranges = [];
      while (start !== end) {
        ranges.push(start);
        start = start.next;
      }
      return new RangesList(ranges);
    };
  
    RangesList.prototype.get = function (i) {
      return this.ranges[i];
    };
  
    _.each("css attr tag addClass removeClass".split(" "), function (i, name) {
      RangesList.prototype[name] = function () {
        _.eachApply(this.ranges, name, arguments);
        return this;
      };
    });
  
    return aString;
  })();
  
  const blockTypeMap = {
      'header-one': 'h1',
    'header-two': 'h2',
    blockquote: 'blockquote',
      unstyled: 'p',
    'ordered-list-item': 'li',
    'unordered-list-item': 'li'
  }
  
  const isListType = function(type) {
    return (type === 'ordered-list-item' || type === 'unordered-list-item')
  }
  
  const wrapperTagNameForListType = function(type) {
    if (type === 'ordered-list-item') {
      return 'ol'
    } else if (type === 'unordered-list-item') {
      return 'ul'
    }
  
    return null
  }
  
  const defaultStyleMap = {
    BOLD: {
      tag: 'strong'
    },
    ITALIC: {
      tag: 'em'
    },
    UNDERLINE: {
      css: {
        'text-decoration': 'underline'
      }
    }
  }
  
  export default function convertToHTML_(blockData, styleMap = defaultStyleMap) {
      let htmlBlocks = []
    let previousBlockType = ''
  
      for (let i = 0; i < blockData.blocks.length; i++) {
          const block = blockData.blocks[i]
          const stringLength = block.text.length
          const attributedString = AttributedString(block.text)
          const stringRange = attributedString.range(0, stringLength)
  
          for (let e = 0; e < block.inlineStyleRanges.length; e++) {
              const styleRange = block.inlineStyleRanges[e]
              let updateRange = attributedString.range(styleRange.offset, styleRange.offset + styleRange.length)
  
        const style = styleMap[styleRange.style] || null
  
        if (style) {
          style.tag && updateRange.tag(style.tag)
          style.css && updateRange.css(style.css)
        }
          }
  
      for (var e = 0; e < block.entityRanges.length; e++) {
        var entityRange = block.entityRanges[e]
        var entity = blockData.entityMap[entityRange.key]
        
        var updateRange = attributedString.range(entityRange.offset, entityRange.offset + entityRange.length)
        
        if (entity.type === "link") {
          updateRange.tag('a')
          updateRange.attr('href', entity.data.href)
          updateRange.attr('target', '_blank')
        }
      }
  
          var tagName = blockTypeMap[block.type] || 'p'
  
      if (isListType(block.type) && block.type != previousBlockType) {
        htmlBlocks.push("<" + wrapperTagNameForListType(block.type) + ">")
      }
  
      if (isListType(previousBlockType) && !isListType(block.type)) {
        htmlBlocks.push("</" + wrapperTagNameForListType(previousBlockType) + ">")
      }
  
      if (stringLength < 1 && tagName.toLowerCase() === 'p') {
        // console.log("Skip empty paragraph")
      } else {
        htmlBlocks.push("<" + tagName + ">" + attributedString.toHtml() + "</" + tagName + ">")
      }
  
      previousBlockType = block.type
      }
  
    if (isListType(previousBlockType)) {
      htmlBlocks.push("</" + wrapperTagNameForListType(previousBlockType) + ">")
    }
  
      return htmlBlocks.join("\n")
  }