/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.5.7
 * Copyright (C) 2014 Oliver Nightingale
 * MIT Licensed
 * @license
 */
!function(){var e=function(t){var i=new e.Index;return i.pipeline.add(e.trimmer,e.stopWordFilter,e.stemmer),t&&t.call(i,i),i};e.version="0.5.7",/*!
   * lunr.utils
   * Copyright (C) 2014 Oliver Nightingale
   */
e.utils={},e.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),/*!
   * lunr.EventEmitter
   * Copyright (C) 2014 Oliver Nightingale
   */
e.EventEmitter=function(){this.events={}},e.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),i=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");i.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},e.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var i=this.events[e].indexOf(t);this.events[e].splice(i,1),this.events[e].length||delete this.events[e]}},e.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)})}},e.EventEmitter.prototype.hasHandler=function(e){return e in this.events},/*!
   * lunr.tokenizer
   * Copyright (C) 2014 Oliver Nightingale
   */
e.tokenizer=function(e){if(!arguments.length||null==e||void 0==e)return[];if(Array.isArray(e))return e.map(function(e){return e.toLowerCase()});for(var t=e.toString().replace(/^\s+/,""),i=t.length-1;i>=0;i--)if(/\S/.test(t.charAt(i))){t=t.substring(0,i+1);break}return t.split(/(?:\s+|\-)/).filter(function(e){return!!e}).map(function(e){return e.toLowerCase()})},/*!
   * lunr.Pipeline
   * Copyright (C) 2014 Oliver Nightingale
   */
e.Pipeline=function(){this._stack=[]},e.Pipeline.registeredFunctions={},e.Pipeline.registerFunction=function(t,i){i in this.registeredFunctions&&e.utils.warn("Overwriting existing registered function: "+i),t.label=i,e.Pipeline.registeredFunctions[t.label]=t},e.Pipeline.warnIfFunctionNotRegistered=function(t){var i=t.label&&t.label in this.registeredFunctions;i||e.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",t)},e.Pipeline.load=function(t){var i=new e.Pipeline;return t.forEach(function(t){var o=e.Pipeline.registeredFunctions[t];if(!o)throw new Error("Cannot load un-registered function: "+t);i.add(o)}),i},e.Pipeline.prototype.add=function(){var t=Array.prototype.slice.call(arguments);t.forEach(function(t){e.Pipeline.warnIfFunctionNotRegistered(t),this._stack.push(t)},this)},e.Pipeline.prototype.after=function(t,i){e.Pipeline.warnIfFunctionNotRegistered(i);var o=this._stack.indexOf(t)+1;this._stack.splice(o,0,i)},e.Pipeline.prototype.before=function(t,i){e.Pipeline.warnIfFunctionNotRegistered(i);var o=this._stack.indexOf(t);this._stack.splice(o,0,i)},e.Pipeline.prototype.remove=function(e){var t=this._stack.indexOf(e);this._stack.splice(t,1)},e.Pipeline.prototype.run=function(e){for(var t=[],i=e.length,o=this._stack.length,n=0;i>n;n++){for(var r=e[n],s=0;o>s&&(r=this._stack[s](r,n,e),void 0!==r);s++);void 0!==r&&t.push(r)}return t},e.Pipeline.prototype.reset=function(){this._stack=[]},e.Pipeline.prototype.toJSON=function(){return this._stack.map(function(t){return e.Pipeline.warnIfFunctionNotRegistered(t),t.label})},/*!
   * lunr.Vector
   * Copyright (C) 2014 Oliver Nightingale
   */
e.Vector=function(){this._magnitude=null,this.list=void 0,this.length=0},e.Vector.Node=function(e,t,i){this.idx=e,this.val=t,this.next=i},e.Vector.prototype.insert=function(t,i){var o=this.list;if(!o)return this.list=new e.Vector.Node(t,i,o),this.length++;for(var n=o,r=o.next;void 0!=r;){if(t<r.idx)return n.next=new e.Vector.Node(t,i,r),this.length++;n=r,r=r.next}return n.next=new e.Vector.Node(t,i,r),this.length++},e.Vector.prototype.magnitude=function(){if(this._magniture)return this._magnitude;for(var e,t=this.list,i=0;t;)e=t.val,i+=e*e,t=t.next;return this._magnitude=Math.sqrt(i)},e.Vector.prototype.dot=function(e){for(var t=this.list,i=e.list,o=0;t&&i;)t.idx<i.idx?t=t.next:t.idx>i.idx?i=i.next:(o+=t.val*i.val,t=t.next,i=i.next);return o},e.Vector.prototype.similarity=function(e){return this.dot(e)/(this.magnitude()*e.magnitude())},/*!
   * lunr.SortedSet
   * Copyright (C) 2014 Oliver Nightingale
   */
e.SortedSet=function(){this.length=0,this.elements=[]},e.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},e.SortedSet.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(e){~this.indexOf(e)||this.elements.splice(this.locationFor(e),0,e)},this),this.length=this.elements.length},e.SortedSet.prototype.toArray=function(){return this.elements.slice()},e.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},e.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},e.SortedSet.prototype.indexOf=function(e,t,i){var t=t||0,i=i||this.elements.length,o=i-t,n=t+Math.floor(o/2),r=this.elements[n];return 1>=o?r===e?n:-1:e>r?this.indexOf(e,n,i):r>e?this.indexOf(e,t,n):r===e?n:void 0},e.SortedSet.prototype.locationFor=function(e,t,i){var t=t||0,i=i||this.elements.length,o=i-t,n=t+Math.floor(o/2),r=this.elements[n];if(1>=o){if(r>e)return n;if(e>r)return n+1}return e>r?this.locationFor(e,n,i):r>e?this.locationFor(e,t,n):void 0},e.SortedSet.prototype.intersect=function(t){for(var i=new e.SortedSet,o=0,n=0,r=this.length,s=t.length,l=this.elements,a=t.elements;;){if(o>r-1||n>s-1)break;l[o]!==a[n]?l[o]<a[n]?o++:l[o]>a[n]&&n++:(i.add(l[o]),o++,n++)}return i},e.SortedSet.prototype.clone=function(){var t=new e.SortedSet;return t.elements=this.toArray(),t.length=t.elements.length,t},e.SortedSet.prototype.union=function(e){var t,i,o;return this.length>=e.length?(t=this,i=e):(t=e,i=this),o=t.clone(),o.add.apply(o,i.toArray()),o},e.SortedSet.prototype.toJSON=function(){return this.toArray()},/*!
   * lunr.Index
   * Copyright (C) 2014 Oliver Nightingale
   */
e.Index=function(){this._fields=[],this._ref="id",this.pipeline=new e.Pipeline,this.documentStore=new e.Store,this.tokenStore=new e.TokenStore,this.corpusTokens=new e.SortedSet,this.eventEmitter=new e.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},e.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},e.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},e.Index.load=function(t){t.version!==e.version&&e.utils.warn("version mismatch: current "+e.version+" importing "+t.version);var i=new this;return i._fields=t.fields,i._ref=t.ref,i.documentStore=e.Store.load(t.documentStore),i.tokenStore=e.TokenStore.load(t.tokenStore),i.corpusTokens=e.SortedSet.load(t.corpusTokens),i.pipeline=e.Pipeline.load(t.pipeline),i},e.Index.prototype.field=function(e,t){var t=t||{},i={name:e,boost:t.boost||1};return this._fields.push(i),this},e.Index.prototype.ref=function(e){return this._ref=e,this},e.Index.prototype.add=function(t,i){var o={},n=new e.SortedSet,r=t[this._ref],i=void 0===i?!0:i;this._fields.forEach(function(i){var r=this.pipeline.run(e.tokenizer(t[i.name]));o[i.name]=r,e.SortedSet.prototype.add.apply(n,r)},this),this.documentStore.set(r,n),e.SortedSet.prototype.add.apply(this.corpusTokens,n.toArray());for(var s=0;s<n.length;s++){var l=n.elements[s],a=this._fields.reduce(function(e,t){var i=o[t.name].length;if(!i)return e;var n=o[t.name].filter(function(e){return e===l}).length;return e+n/i*t.boost},0);this.tokenStore.add(l,{ref:r,tf:a})}i&&this.eventEmitter.emit("add",t,this)},e.Index.prototype.remove=function(e,t){var i=e[this._ref],t=void 0===t?!0:t;if(this.documentStore.has(i)){var o=this.documentStore.get(i);this.documentStore.remove(i),o.forEach(function(e){this.tokenStore.remove(e,i)},this),t&&this.eventEmitter.emit("remove",e,this)}},e.Index.prototype.update=function(e,t){var t=void 0===t?!0:t;this.remove(e,!1),this.add(e,!1),t&&this.eventEmitter.emit("update",e,this)},e.Index.prototype.idf=function(e){var t="@"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,t))return this._idfCache[t];var i=this.tokenStore.count(e),o=1;return i>0&&(o=1+Math.log(this.tokenStore.length/i)),this._idfCache[t]=o},e.Index.prototype.search=function(t){var i=this.pipeline.run(e.tokenizer(t)),o=new e.Vector,n=[],r=this._fields.reduce(function(e,t){return e+t.boost},0),s=i.some(function(e){return this.tokenStore.has(e)},this);if(!s)return[];i.forEach(function(t,i,s){var l=1/s.length*this._fields.length*r,a=this,c=this.tokenStore.expand(t).reduce(function(i,n){var r=a.corpusTokens.indexOf(n),s=a.idf(n),c=1,u=new e.SortedSet;if(n!==t){var d=Math.max(3,n.length-t.length);c=1/Math.log(d)}return r>-1&&o.insert(r,l*s*c),Object.keys(a.tokenStore.get(n)).forEach(function(e){u.add(e)}),i.union(u)},new e.SortedSet);n.push(c)},this);var l=n.reduce(function(e,t){return e.intersect(t)});return l.map(function(e){return{ref:e,score:o.similarity(this.documentVector(e))}},this).sort(function(e,t){return t.score-e.score})},e.Index.prototype.documentVector=function(t){for(var i=this.documentStore.get(t),o=i.length,n=new e.Vector,r=0;o>r;r++){var s=i.elements[r],l=this.tokenStore.get(s)[t].tf,a=this.idf(s);n.insert(this.corpusTokens.indexOf(s),l*a)}return n},e.Index.prototype.toJSON=function(){return{version:e.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},e.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},/*!
   * lunr.Store
   * Copyright (C) 2014 Oliver Nightingale
   */
e.Store=function(){this.store={},this.length=0},e.Store.load=function(t){var i=new this;return i.length=t.length,i.store=Object.keys(t.store).reduce(function(i,o){return i[o]=e.SortedSet.load(t.store[o]),i},{}),i},e.Store.prototype.set=function(e,t){this.has(e)||this.length++,this.store[e]=t},e.Store.prototype.get=function(e){return this.store[e]},e.Store.prototype.has=function(e){return e in this.store},e.Store.prototype.remove=function(e){this.has(e)&&(delete this.store[e],this.length--)},e.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},/*!
   * lunr.stemmer
   * Copyright (C) 2014 Oliver Nightingale
   * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
   */
e.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},i="[^aeiou]",o="[aeiouy]",n=i+"[^aeiouy]*",r=o+"[aeiou]*",s="^("+n+")?"+r+n,l="^("+n+")?"+r+n+"("+r+")?$",a="^("+n+")?"+r+n+r+n,c="^("+n+")?"+o,u=new RegExp(s),d=new RegExp(a),h=new RegExp(l),p=new RegExp(c),f=/^(.+?)(ss|i)es$/,g=/^(.+?)([^s])s$/,m=/^(.+?)eed$/,v=/^(.+?)(ed|ing)$/,x=/.$/,S=/(at|bl|iz)$/,y=new RegExp("([^aeiouylsz])\\1$"),w=new RegExp("^"+n+o+"[^aeiouwxy]$"),b=/^(.+?[^aeiou])y$/,F=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,T=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,k=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,E=/^(.+?)(s|t)(ion)$/,N=/^(.+?)e$/,O=/ll$/,$=new RegExp("^"+n+o+"[^aeiouwxy]$"),_=function(i){var o,n,r,s,l,a,c;if(i.length<3)return i;if(r=i.substr(0,1),"y"==r&&(i=r.toUpperCase()+i.substr(1)),s=f,l=g,s.test(i)?i=i.replace(s,"$1$2"):l.test(i)&&(i=i.replace(l,"$1$2")),s=m,l=v,s.test(i)){var _=s.exec(i);s=u,s.test(_[1])&&(s=x,i=i.replace(s,""))}else if(l.test(i)){var _=l.exec(i);o=_[1],l=p,l.test(o)&&(i=o,l=S,a=y,c=w,l.test(i)?i+="e":a.test(i)?(s=x,i=i.replace(s,"")):c.test(i)&&(i+="e"))}if(s=b,s.test(i)){var _=s.exec(i);o=_[1],i=o+"i"}if(s=F,s.test(i)){var _=s.exec(i);o=_[1],n=_[2],s=u,s.test(o)&&(i=o+e[n])}if(s=T,s.test(i)){var _=s.exec(i);o=_[1],n=_[2],s=u,s.test(o)&&(i=o+t[n])}if(s=k,l=E,s.test(i)){var _=s.exec(i);o=_[1],s=d,s.test(o)&&(i=o)}else if(l.test(i)){var _=l.exec(i);o=_[1]+_[2],l=d,l.test(o)&&(i=o)}if(s=N,s.test(i)){var _=s.exec(i);o=_[1],s=d,l=h,a=$,(s.test(o)||l.test(o)&&!a.test(o))&&(i=o)}return s=O,l=d,s.test(i)&&l.test(i)&&(s=x,i=i.replace(s,"")),"y"==r&&(i=r.toLowerCase()+i.substr(1)),i};return _}(),e.Pipeline.registerFunction(e.stemmer,"stemmer"),/*!
   * lunr.stopWordFilter
   * Copyright (C) 2014 Oliver Nightingale
   */
e.stopWordFilter=function(t){return-1===e.stopWordFilter.stopWords.indexOf(t)?t:void 0},e.stopWordFilter.stopWords=new e.SortedSet,e.stopWordFilter.stopWords.length=119,e.stopWordFilter.stopWords.elements=["","a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"],e.Pipeline.registerFunction(e.stopWordFilter,"stopWordFilter"),/*!
   * lunr.trimmer
   * Copyright (C) 2014 Oliver Nightingale
   */
e.trimmer=function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"")},e.Pipeline.registerFunction(e.trimmer,"trimmer"),/*!
   * lunr.stemmer
   * Copyright (C) 2014 Oliver Nightingale
   * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
   */
e.TokenStore=function(){this.root={docs:{}},this.length=0},e.TokenStore.load=function(e){var t=new this;return t.root=e.root,t.length=e.length,t},e.TokenStore.prototype.add=function(e,t,i){var i=i||this.root,o=e[0],n=e.slice(1);return o in i||(i[o]={docs:{}}),0===n.length?(i[o].docs[t.ref]=t,void(this.length+=1)):this.add(n,t,i[o])},e.TokenStore.prototype.has=function(e){if(!e)return!1;for(var t=this.root,i=0;i<e.length;i++){if(!t[e[i]])return!1;t=t[e[i]]}return!0},e.TokenStore.prototype.getNode=function(e){if(!e)return{};for(var t=this.root,i=0;i<e.length;i++){if(!t[e[i]])return{};t=t[e[i]]}return t},e.TokenStore.prototype.get=function(e,t){return this.getNode(e,t).docs||{}},e.TokenStore.prototype.count=function(e,t){return Object.keys(this.get(e,t)).length},e.TokenStore.prototype.remove=function(e,t){if(e){for(var i=this.root,o=0;o<e.length;o++){if(!(e[o]in i))return;i=i[e[o]]}delete i.docs[t]}},e.TokenStore.prototype.expand=function(e,t){var i=this.getNode(e),o=i.docs||{},t=t||[];return Object.keys(o).length&&t.push(e),Object.keys(i).forEach(function(i){"docs"!==i&&t.concat(this.expand(e+i,t))},this),t},e.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.lunr=t()}(this,function(){return e})}();