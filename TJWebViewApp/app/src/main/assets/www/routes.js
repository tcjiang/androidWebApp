(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({2:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!-- Copyright 2015 BlackBerry Ltd.\n\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n\n You may obtain a copy of the License at\n http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n express or implied. See the License for the specific language\n governing permissions and limitations under the License. -->\n\n<el-page data-routename="about" ng-controller="aboutCtrl" el-on="{statechange: \'onStateChange($event)\'}">\n  <el-bar data-drawerbutton="auto" data-backbutton="auto">\n      <div class="title">About</div>\n  </el-bar>\n  <el-page-content>\n    <div ng-show="buildInfo">\n        <div class="el-row name-row">\n            <div class="fa-stack fa-2x">\n                <span class="fa fa-circle-thin fa-stack-2x"></span>\n                <span class="fa fa-bug fa-stack-1x"></span>\n            </div>\n            <h1>\n                Debug info\n            </h1>\n        </div>\n\n        <div class="sections-container" >\n            <div class="sections-panel">\n                <div class="item-details-section iw50 compact_iw100">\n                    <h3>Build</h3>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Grunt</h4>\n                                <p>Date: {{buildInfo.gruntDate}}<br>\n                                Host: {{buildInfo.gruntHost}}<br>\n                                Platform: {{buildInfo.gruntPlatform}}</p>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Git</h4>\n                                <p> Branch: {{buildInfo.branch}}<br>\n                                SHA: {{buildInfo.sha}}<br>\n                                Commit: {{buildInfo.message}}<br>\n                                Local modifications: {{buildInfo.changes}}</p>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Rest host</h4>\n                                <p> Host: {{buildInfo.restHost}}</p>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Versions</h4>\n                                <p>Elsa: {{buildInfo.elsaVersion}}</p>\n                            </div>\n                        </div>\n                    </div>\n                    <br>\n                    <h3>Browser</h3>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Versions</h4>\n                                <p>Browser: {{buildInfo.browser}}<br>\n                                OS: {{buildInfo.os}}</p>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="el-row">\n                        <div class="el-col">\n                            <div class="item-details-info">\n                                <h4>Screen size</h4>\n                                <p>{{buildInfo.innerWidth}} x {{buildInfo.innerHeight}}</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n  </el-page-content>\n</el-page>\n';
}
return __p;
};

},{}],3:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!-- Copyright 2015 BlackBerry Ltd.\n\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n\n You may obtain a copy of the License at\n http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n express or implied. See the License for the specific language\n governing permissions and limitations under the License. -->\n\n<el-drawer class="with-icons" data-routename="drawer" ng-controller="drawerCtrl" el-on="{statechange: \'onStateChange($event)\'}">\n     <nav>\n         <div class="el-flex el-grow"></div>\n         <el-header data-label="Categories"></el-header>\n         <el-draweritem data-iconclass="fa fa-home" data-label="Home" data-defaultroute="home"></el-draweritem>\n         <el-draweritem data-iconclass="fa fa-bell" data-label="Notifications" data-defaultroute="notifications"></el-draweritem>\n         <el-draweritem data-iconclass="fa fa-info" data-label="About" data-defaultroute="about"></el-draweritem>\n         <el-header id="workspaces" data-label="Workspaces"></el-header>\n\n         <el-draweritem ng-repeat="workspace in workspaces" data-iconclass="fa fa-folder" data-label="{{workspace.title}}"\n            data-defaultroute="{{\'workspace?type=\' + workspace.type + \'&title=\' + workspace.title + \'&lastModified=\' + workspace.lastModified\n            + \'&state=\' + workspace.state}}"></el-draweritem>\n\n         <el-action class="horizontal" id="logout" data-label="Logout" ng-click="logout()"></el-action>\n         <div class="el-flex el-grow"></div>\n     </nav>\n</el-drawer>\n';
}
return __p;
};

},{}],4:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!-- Copyright 2015 BlackBerry Ltd.\n\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n\n You may obtain a copy of the License at\n http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n express or implied. See the License for the specific language\n governing permissions and limitations under the License. -->\n\n<el-page data-routename="home" ng-controller="homeCtrl" el-on="{statechange: \'onStateChange($event)\'}">\n     <el-bar data-backbutton="auto" data-drawerbutton="auto">\n        <div class="title">Home</div>\n     </el-bar>\n     <el-page-content>\n     </el-page-content>\n     <el-action el-on="{trigger: \'navigateTo(\\\'about\\\')\'}" class="signature" data-label="Next" data-iconclass="fa fa-angle-right"></el-action>\n</el-page>\n';
}
return __p;
};

},{}],5:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<el-page class="login" ng-controller="loginCtrl" data-routename="login">\n    <el-page-content>\n        <div style="text-align: left;">\n            <p class="title">BES<span>12</span></p>\n            <p class="title2">Multi-OS Enterprise Mobility Management</p>\n        </div>\n        <p class="feedbackArea">{{error}}</p>\n        <div class="login-box">\n            <form class="login-screen" id="login" role="form" ng-submit="login()">\n                <input id="username" type="text" placeholder="username" name="username" ng-model="credentials.username"/>\n                <input id="password" type="password" placeholder="password" name="password" ng-model="credentials.password"/>\n                <button class="btn-primary" type="submit">\n                    SIGN IN\n                </button>\n            </form>\n        </div>\n        <p class="welcome">Test server account: Administrator/Administrator</p>\n        <footer>© 2015 Blackberry All rights reserved</footer>\n    </el-page-content>\n</el-page>\n';
}
return __p;
};

},{}],6:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<el-page data-routename="notifications" ng-controller="notificationsCtrl" el-on="{statechange: \'onStateChange($event)\'}">\n    <el-bar data-drawerbutton="auto">\n       <div class="title">Notifications</div>\n    </el-bar>\n    <el-page-content>\n        Search: <input ng-model="query">\n        <div class="header row">\n            <div class="item">Performed Action</div>\n            <div class="item">Date</div>\n            <div class="item">User Name</div>\n            <div class="item">Category</div>\n            <div class="item">Comment</div>\n            <div class="item">State</div>\n        </div>\n        <ul>\n            <li ng-repeat="log in logs | filter:query">\n                <div class="row">\n                    <div class="item">{{log.eventId}}</div>\n                    <div class="item">{{log.eventDate}}</div>\n                    <div class="item">{{log.principalName}}</div>\n                    <div class="item">{{log.category}}</div>\n                    <div class="item">{{log.comment}}</div>\n                    <div class="item">{{log.docLifeCycle}}</div>\n                </div>\n            </li>\n        </ul>\n    </el-page-content>\n</el-page>\n';
}
return __p;
};

},{}],7:[function(require,module,exports){
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<!-- Copyright 2015 BlackBerry Ltd.\n\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n\n You may obtain a copy of the License at\n http://www.apache.org/licenses/LICENSE-2.0\n\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n express or implied. See the License for the specific language\n governing permissions and limitations under the License. -->\n\n<el-page data-routename="workspace" ng-controller="workspaceCtrl" el-on="{statechange: \'onStateChange($event)\'}">\n     <el-bar>\n        <div class="title">{{details.title}}</div>\n     </el-bar>\n     <el-page-content>\n         <div>Type: {{details.type}}</div>\n         <div>State: {{details.state}}</div>\n         <div>Last Modified: {{details.lastModified}}</div>\n         <br/><br/>\n\n         <div ng-hide="isEmpty">\n             <strong>Files and Folders</strong>\n             <div ng-repeat="content in workspaceContents">\n                <div>Name: {{content.title}}</div>\n                <div>Type: {{content.type}}</div>\n                <div>Last Modified: {{content.lastModified}}</div>\n                <br/>\n             </div>\n         </div>\n\n         <div ng-show="isEmpty">\n            Workspace is empty!\n         </div>\n     </el-page-content>\n</el-page>\n';
}
return __p;
};

},{}],1:[function(require,module,exports){
elsa.App.registerRoutes({
	"login": {
		"name": "login",
		"href": " 1",
		"path": "/workspace-client-app/src/routables/login/login.html"
	},
	"drawer": {
		"name": "drawer",
		"href": " 2",
		"path": "/workspace-client-app/src/routables/drawer/drawer.html"
	},
	"notifications": {
		"name": "notifications",
		"href": " 3",
		"path": "/workspace-client-app/src/routables/notifications/notifications.html"
	},
	"home": {
		"name": "home",
		"href": " 4",
		"path": "/workspace-client-app/src/routables/home/home.html"
	},
	"workspace": {
		"name": "workspace",
		"href": " 5",
		"path": "/workspace-client-app/src/routables/workspace/workspace.html"
	},
	"about": {
		"name": "about",
		"href": " 6",
		"path": "/workspace-client-app/src/routables/about/about.html"
	}
}, require, {"elsa":"0.0.28-dev"});
/* Copyright 2015 BlackBerry Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License. */

angular.module("workspace-client-app", ["elsa", 'ngRoute']);

function load() {
    elsa.App.initialize('login');
}

document.addEventListener("DOMContentLoaded", load, false);

},{" 1":5," 2":3," 3":6," 4":4," 5":7," 6":2}]},{},[1]);
