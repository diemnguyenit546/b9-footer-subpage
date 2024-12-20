var FixedHeader=function(mTable,oInit){if(typeof this.fnInit!='function')
{alert("FixedHeader warning: FixedHeader must be initialised with the 'new' keyword.");return;}
var that=this;var oSettings={"aoCache":[],"oSides":{"top":true,"bottom":false,"left":false,"right":false},"oZIndexes":{"top":104,"bottom":103,"left":102,"right":101},"oMes":{"iTableWidth":0,"iTableHeight":0,"iTableLeft":0,"iTableRight":0,"iTableTop":0,"iTableBottom":0},"oOffset":{"top":0},"nTable":null,"bUseAbsPos":false,"bFooter":false};this.fnGetSettings=function(){return oSettings;};this.fnUpdate=function(){this._fnUpdateClones();this._fnUpdatePositions();};this.fnPosition=function(){this._fnUpdatePositions();};this.fnInit(mTable,oInit);if(typeof mTable.fnSettings=='function')
{mTable._oPluginFixedHeader=this;}};FixedHeader.prototype={fnInit:function(oTable,oInit)
{var s=this.fnGetSettings();var that=this;this.fnInitSettings(s,oInit);if(typeof oTable.fnSettings=='function')
{if(typeof oTable.fnVersionCheck=='functon'&&oTable.fnVersionCheck('1.6.0')!==true)
{alert("FixedHeader 2 required DataTables 1.6.0 or later. "+
"Please upgrade your DataTables installation");return;}
var oDtSettings=oTable.fnSettings();if(oDtSettings.oScroll.sX!=""||oDtSettings.oScroll.sY!="")
{alert("FixedHeader 2 is not supported with DataTables' scrolling mode at this time");return;}
s.nTable=oDtSettings.nTable;oDtSettings.aoDrawCallback.push({"fn":function(){FixedHeader.fnMeasure();that._fnUpdateClones.call(that);that._fnUpdatePositions.call(that);},"sName":"FixedHeader"});}
else
{s.nTable=oTable;}
s.bFooter=($('>tfoot',s.nTable).length>0)?true:false;s.bUseAbsPos=(jQuery.browser.msie&&(jQuery.browser.version=="6.0"||jQuery.browser.version=="7.0"));if(s.oSides.top)
{s.aoCache.push(that._fnCloneTable("fixedHeader","FixedHeader_Header",that._fnCloneThead));}
if(s.oSides.bottom)
{s.aoCache.push(that._fnCloneTable("fixedFooter","FixedHeader_Footer",that._fnCloneTfoot));}
if(s.oSides.left)
{s.aoCache.push(that._fnCloneTable("fixedLeft","FixedHeader_Left",that._fnCloneTLeft));}
if(s.oSides.right)
{s.aoCache.push(that._fnCloneTable("fixedRight","FixedHeader_Right",that._fnCloneTRight));}
FixedHeader.afnScroll.push(function(){that._fnUpdatePositions.call(that);});jQuery(window).resize(function(){FixedHeader.fnMeasure();that._fnUpdateClones.call(that);that._fnUpdatePositions.call(that);});FixedHeader.fnMeasure();that._fnUpdateClones();that._fnUpdatePositions();},fnInitSettings:function(s,oInit)
{if(typeof oInit!='undefined')
{if(typeof oInit.top!='undefined'){s.oSides.top=oInit.top;}
if(typeof oInit.bottom!='undefined'){s.oSides.bottom=oInit.bottom;}
if(typeof oInit.left!='undefined'){s.oSides.left=oInit.left;}
if(typeof oInit.right!='undefined'){s.oSides.right=oInit.right;}
if(typeof oInit.zTop!='undefined'){s.oZIndexes.top=oInit.zTop;}
if(typeof oInit.zBottom!='undefined'){s.oZIndexes.bottom=oInit.zBottom;}
if(typeof oInit.zLeft!='undefined'){s.oZIndexes.left=oInit.zLeft;}
if(typeof oInit.zRight!='undefined'){s.oZIndexes.right=oInit.zRight;}
if(typeof oInit.offsetTop!='undefined'){s.oOffset.top=oInit.offsetTop;}}
s.bUseAbsPos=(jQuery.browser.msie&&(jQuery.browser.version=="6.0"||jQuery.browser.version=="7.0"));},_fnCloneTable:function(sType,sClass,fnClone)
{var s=this.fnGetSettings();var nCTable;if(jQuery(s.nTable.parentNode).css('position')!="absolute")
{s.nTable.parentNode.style.position="relative";}
nCTable=s.nTable.cloneNode(false);nCTable.removeAttribute('id');var nDiv=document.createElement('div');nDiv.style.position="absolute";nDiv.style.top="0px";nDiv.style.left="0px";nDiv.className+=" FixedHeader_Cloned "+sType+" "+sClass;if(sType=="fixedHeader")
{nDiv.style.zIndex=s.oZIndexes.top;}
if(sType=="fixedFooter")
{nDiv.style.zIndex=s.oZIndexes.bottom;}
if(sType=="fixedLeft")
{nDiv.style.zIndex=s.oZIndexes.left;}
else if(sType=="fixedRight")
{nDiv.style.zIndex=s.oZIndexes.right;}
nCTable.style.margin="0";nDiv.appendChild(nCTable);document.body.appendChild(nDiv);return{"nNode":nCTable,"nWrapper":nDiv,"sType":sType,"sPosition":"","sTop":"","sLeft":"","fnClone":fnClone};},_fnMeasure:function()
{var
s=this.fnGetSettings(),m=s.oMes,jqTable=jQuery(s.nTable),oOffset=jqTable.offset(),iParentScrollTop=this._fnSumScroll(s.nTable.parentNode,'scrollTop'),iParentScrollLeft=this._fnSumScroll(s.nTable.parentNode,'scrollLeft');m.iTableWidth=jqTable.outerWidth();m.iTableHeight=jqTable.outerHeight();m.iTableLeft=oOffset.left+s.nTable.parentNode.scrollLeft;m.iTableTop=oOffset.top+iParentScrollTop;m.iTableRight=m.iTableLeft+m.iTableWidth;m.iTableRight=FixedHeader.oDoc.iWidth-m.iTableLeft-m.iTableWidth;m.iTableBottom=FixedHeader.oDoc.iHeight-m.iTableTop-m.iTableHeight;},_fnSumScroll:function(n,side)
{var i=n[side];while(n=n.parentNode)
{if(n.nodeName=='HTML'||n.nodeName=='BODY')
{break;}
i=n[side];}
return i;},_fnUpdatePositions:function()
{var s=this.fnGetSettings();this._fnMeasure();for(var i=0,iLen=s.aoCache.length;i<iLen;i++)
{if(s.aoCache[i].sType=="fixedHeader")
{this._fnScrollFixedHeader(s.aoCache[i]);}
else if(s.aoCache[i].sType=="fixedFooter")
{this._fnScrollFixedFooter(s.aoCache[i]);}
else if(s.aoCache[i].sType=="fixedLeft")
{this._fnScrollHorizontalLeft(s.aoCache[i]);}
else
{this._fnScrollHorizontalRight(s.aoCache[i]);}}},_fnUpdateClones:function()
{var s=this.fnGetSettings();for(var i=0,iLen=s.aoCache.length;i<iLen;i++)
{s.aoCache[i].fnClone.call(this,s.aoCache[i]);}},_fnScrollHorizontalRight:function(oCache)
{var
s=this.fnGetSettings(),oMes=s.oMes,oWin=FixedHeader.oWin,oDoc=FixedHeader.oDoc,nTable=oCache.nWrapper,iFixedWidth=jQuery(nTable).outerWidth();if(oWin.iScrollRight<oMes.iTableRight)
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oMes.iTableLeft+oMes.iTableWidth-iFixedWidth)+"px",'left',nTable.style);}
else if(oMes.iTableLeft<oDoc.iWidth-oWin.iScrollRight-iFixedWidth)
{if(s.bUseAbsPos)
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oDoc.iWidth-oWin.iScrollRight-iFixedWidth)+"px",'left',nTable.style);}
else
{this._fnUpdateCache(oCache,'sPosition','fixed','position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oMes.iTableTop-oWin.iScrollTop)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oWin.iWidth-iFixedWidth)+"px",'left',nTable.style);}}
else
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}},_fnScrollHorizontalLeft:function(oCache)
{var
s=this.fnGetSettings(),oMes=s.oMes,oWin=FixedHeader.oWin,oDoc=FixedHeader.oDoc,nTable=oCache.nWrapper,iCellWidth=jQuery(nTable).outerWidth();if(oWin.iScrollLeft<oMes.iTableLeft)
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else if(oWin.iScrollLeft<oMes.iTableLeft+oMes.iTableWidth-iCellWidth)
{if(s.bUseAbsPos)
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oWin.iScrollLeft+"px",'left',nTable.style);}
else
{this._fnUpdateCache(oCache,'sPosition','fixed','position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oMes.iTableTop-oWin.iScrollTop)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',"0px",'left',nTable.style);}}
else
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oMes.iTableLeft+oMes.iTableWidth-iCellWidth)+"px",'left',nTable.style);}},_fnScrollFixedFooter:function(oCache)
{var
s=this.fnGetSettings(),oMes=s.oMes,oWin=FixedHeader.oWin,oDoc=FixedHeader.oDoc,nTable=oCache.nWrapper,iTheadHeight=jQuery("thead",s.nTable).outerHeight(),iCellHeight=jQuery(nTable).outerHeight();if(oWin.iScrollBottom<oMes.iTableBottom)
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oMes.iTableTop+oMes.iTableHeight-iCellHeight)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else if(oWin.iScrollBottom<oMes.iTableBottom+oMes.iTableHeight-iCellHeight-iTheadHeight)
{if(s.bUseAbsPos)
{this._fnUpdateCache(oCache,'sPosition',"absolute",'position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oDoc.iHeight-oWin.iScrollBottom-iCellHeight)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else
{this._fnUpdateCache(oCache,'sPosition','fixed','position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oWin.iHeight-iCellHeight)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oMes.iTableLeft-oWin.iScrollLeft)+"px",'left',nTable.style);}}
else
{this._fnUpdateCache(oCache,'sPosition','absolute','position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oMes.iTableTop+iCellHeight)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}},_fnScrollFixedHeader:function(oCache)
{var
s=this.fnGetSettings(),oMes=s.oMes,oWin=FixedHeader.oWin,oDoc=FixedHeader.oDoc,nTable=oCache.nWrapper,iTbodyHeight=0,anTbodies=s.nTable.getElementsByTagName('tbody');for(var i=0;i<anTbodies.length;++i){iTbodyHeight+=anTbodies[i].offsetHeight;}
if(oMes.iTableTop>oWin.iScrollTop+s.oOffset.top)
{this._fnUpdateCache(oCache,'sPosition',"absolute",'position',nTable.style);this._fnUpdateCache(oCache,'sTop',oMes.iTableTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else if(oWin.iScrollTop+s.oOffset.top>oMes.iTableTop+iTbodyHeight)
{this._fnUpdateCache(oCache,'sPosition',"absolute",'position',nTable.style);this._fnUpdateCache(oCache,'sTop',(oMes.iTableTop+iTbodyHeight)+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else
{if(s.bUseAbsPos)
{this._fnUpdateCache(oCache,'sPosition',"absolute",'position',nTable.style);this._fnUpdateCache(oCache,'sTop',oWin.iScrollTop+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',oMes.iTableLeft+"px",'left',nTable.style);}
else
{this._fnUpdateCache(oCache,'sPosition','fixed','position',nTable.style);this._fnUpdateCache(oCache,'sTop',s.oOffset.top+"px",'top',nTable.style);this._fnUpdateCache(oCache,'sLeft',(oMes.iTableLeft-oWin.iScrollLeft)+"px",'left',nTable.style);}}},_fnUpdateCache:function(oCache,sCache,sSet,sProperty,oObj)
{if(oCache[sCache]!=sSet)
{oObj[sProperty]=sSet;oCache[sCache]=sSet;}},_fnCloneThead:function(oCache)
{var s=this.fnGetSettings();var nTable=oCache.nNode;oCache.nWrapper.style.width=jQuery(s.nTable).outerWidth()+"px";while(nTable.childNodes.length>0)
{jQuery('thead th',nTable).unbind('click');nTable.removeChild(nTable.childNodes[0]);}
var nThead=jQuery('thead',s.nTable).clone(true)[0];nTable.appendChild(nThead);jQuery("thead>tr th",s.nTable).each(function(i){jQuery("thead>tr th:eq("+i+")",nTable).width(jQuery(this).width());});jQuery("thead>tr td",s.nTable).each(function(i){jQuery("thead>tr td:eq("+i+")",nTable).width(jQuery(this).width());});},_fnCloneTfoot:function(oCache)
{var s=this.fnGetSettings();var nTable=oCache.nNode;oCache.nWrapper.style.width=jQuery(s.nTable).outerWidth()+"px";while(nTable.childNodes.length>0)
{nTable.removeChild(nTable.childNodes[0]);}
var nTfoot=jQuery('tfoot',s.nTable).clone(true)[0];nTable.appendChild(nTfoot);jQuery("tfoot:eq(0)>tr th",s.nTable).each(function(i){jQuery("tfoot:eq(0)>tr th:eq("+i+")",nTable).width(jQuery(this).width());});jQuery("tfoot:eq(0)>tr td",s.nTable).each(function(i){jQuery("tfoot:eq(0)>tr th:eq("+i+")",nTable)[0].style.width(jQuery(this).width());});},_fnCloneTLeft:function(oCache)
{var s=this.fnGetSettings();var nTable=oCache.nNode;var nBody=$('tbody',s.nTable)[0];var iCols=$('tbody tr:eq(0) td',s.nTable).length;var bRubbishOldIE=($.browser.msie&&($.browser.version=="6.0"||$.browser.version=="7.0"));while(nTable.childNodes.length>0)
{nTable.removeChild(nTable.childNodes[0]);}
nTable.appendChild(jQuery("thead",s.nTable).clone(true)[0]);nTable.appendChild(jQuery("tbody",s.nTable).clone(true)[0]);if(s.bFooter)
{nTable.appendChild(jQuery("tfoot",s.nTable).clone(true)[0]);}
$('thead tr',nTable).each(function(k){$('th:gt(0)',this).remove();});$('tfoot tr',nTable).each(function(k){$('th:gt(0)',this).remove();});$('tbody tr',nTable).each(function(k){$('td:gt(0)',this).remove();});this.fnEqualiseHeights('tbody',nBody.parentNode,nTable);var iWidth=jQuery('thead tr th:eq(0)',s.nTable).outerWidth();nTable.style.width=iWidth+"px";oCache.nWrapper.style.width=iWidth+"px";},_fnCloneTRight:function(oCache)
{var s=this.fnGetSettings();var nBody=$('tbody',s.nTable)[0];var nTable=oCache.nNode;var iCols=jQuery('tbody tr:eq(0) td',s.nTable).length;var bRubbishOldIE=($.browser.msie&&($.browser.version=="6.0"||$.browser.version=="7.0"));while(nTable.childNodes.length>0)
{nTable.removeChild(nTable.childNodes[0]);}
nTable.appendChild(jQuery("thead",s.nTable).clone(true)[0]);nTable.appendChild(jQuery("tbody",s.nTable).clone(true)[0]);if(s.bFooter)
{nTable.appendChild(jQuery("tfoot",s.nTable).clone(true)[0]);}
jQuery('thead tr th:not(:nth-child('+iCols+'n))',nTable).remove();jQuery('tfoot tr th:not(:nth-child('+iCols+'n))',nTable).remove();$('tbody tr',nTable).each(function(k){$('td:lt('+(iCols-1)+')',this).remove();});this.fnEqualiseHeights('tbody',nBody.parentNode,nTable);var iWidth=jQuery('thead tr th:eq('+(iCols-1)+')',s.nTable).outerWidth();nTable.style.width=iWidth+"px";oCache.nWrapper.style.width=iWidth+"px";},"fnEqualiseHeights":function(parent,original,clone)
{var that=this,jqBoxHack=$(parent+' tr:eq(0)',original).children(':eq(0)'),iBoxHack=jqBoxHack.outerHeight()-jqBoxHack.height(),bRubbishOldIE=($.browser.msie&&($.browser.version=="6.0"||$.browser.version=="7.0"));$(parent+' tr',clone).each(function(k){if($.browser.mozilla||$.browser.opera)
{$(this).children().height($(parent+' tr:eq('+k+')',original).outerHeight());}
else
{$(this).children().height($(parent+' tr:eq('+k+')',original).outerHeight()-iBoxHack);}
if(!bRubbishOldIE)
{$(parent+' tr:eq('+k+')',original).height($(parent+' tr:eq('+k+')',original).outerHeight());}});}};FixedHeader.oWin={"iScrollTop":0,"iScrollRight":0,"iScrollBottom":0,"iScrollLeft":0,"iHeight":0,"iWidth":0};FixedHeader.oDoc={"iHeight":0,"iWidth":0};FixedHeader.afnScroll=[];FixedHeader.fnMeasure=function()
{var
jqWin=jQuery(window),jqDoc=jQuery(document),oWin=FixedHeader.oWin,oDoc=FixedHeader.oDoc;oDoc.iHeight=jqDoc.height();oDoc.iWidth=jqDoc.width();oWin.iHeight=jqWin.height();oWin.iWidth=jqWin.width();oWin.iScrollTop=jqWin.scrollTop();oWin.iScrollLeft=jqWin.scrollLeft();oWin.iScrollRight=oDoc.iWidth-oWin.iScrollLeft-oWin.iWidth;oWin.iScrollBottom=oDoc.iHeight-oWin.iScrollTop-oWin.iHeight;};FixedHeader.VERSION="2.0.6";FixedHeader.prototype.VERSION=FixedHeader.VERSION;jQuery(window).scroll(function(){FixedHeader.fnMeasure();for(var i=0,iLen=FixedHeader.afnScroll.length;i<iLen;i++)
{FixedHeader.afnScroll[i]();}});