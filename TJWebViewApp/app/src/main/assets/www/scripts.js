var hostConfig = {
    "host": "http://10.121.60.91",
    "port": "8080"
};
window.sl = {
    io:  {
        restHost: hostConfig.host + ":" + hostConfig.port + "/",
        getRestUrl: function(path) {
            path = (typeof path !== "undefined") ? path : '';
            return window.sl.io.restHost + path;
        }
    }
};


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

angular.module("workspace-client-app").controller("aboutCtrl", ['$scope', function($scope) {

    //initialization code goes here
    console.log('init about controller');

    if (window.buildInfo) {
        var useragent = window.useragent;
        var buildInfo = window.buildInfo;
        var agent = useragent.parse(navigator.userAgent);
        var browser = agent.toAgent();
        var os = agent.os.toString();

        $scope.buildInfo = {
            restHost:window.sl.io.restHost,
            browser:browser, os:os,
            innerWidth:window.innerWidth, innerHeight:window.innerHeight,
            sha:buildInfo.sha, branch:buildInfo.branch,
            message:buildInfo.message, changes:buildInfo.changes,
            gruntDate:buildInfo.gruntDate, gruntHost:buildInfo.gruntHost,
            gruntPlatform:buildInfo.gruntPlatform,
            elsaVersion:buildInfo.elsaVersion
        };
    }

    $scope.onStateChange = function(e) {
        //this executes whenever the state for this routable changes
        console.log(e.state);
    };
}]);

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

angular.module("workspace-client-app").controller("drawerCtrl", ['$scope', 'nuxeo', function($scope, nuxeo) {

    //initialization code goes here
    var workspacesFetched = false;

    $scope.onStateChange = function(e) {
        //this executes whenever the state for this routable changes
        if (!workspacesFetched) {
            nuxeo.getChildren('doc:/default-domain/workspaces', function(children) {
                if (children.length > 0) {
                    workspacesFetched = true;

                    $scope.$apply(function () {
                        $scope.workspaces = children;
                    });
                }
            });
        }
    };

}]);

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

angular.module("workspace-client-app").controller("homeCtrl", function($scope) {

    //initialization code goes here
    console.log('init drawer controller');

    $scope.onStateChange = function(e) {
        //this executes whenever the state for this routable changes
        console.log(e.state);
    };

});

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

angular.module('workspace-client-app').controller('loginCtrl', ['$rootScope', '$scope', '$http', 'nuxeo', function($rootScope, $scope, $http, nuxeo) {
    var authenticate = function(credentials, callback) {
        var headers;
        if(credentials) {
            headers = {authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)};
        } else {
            headers = {};
        }

        $http.get(window.sl.io.getRestUrl('nuxeo/site/automation'), {headers: headers}).success(function(data) {
            $rootScope.authenticated = true;
            nuxeo.createNuxeoClient(credentials);
            callback();
        }).error(function() {
            $rootScope.authenticated = false;
            callback();
        });
    };

    //FIXME: For developer convenience keep login info.
    $scope.credentials = {
        username: 'Administrator',
        password: 'Administrator'
    };
    $scope.login = function() {
        authenticate($scope.credentials, function() {
            if ($rootScope.authenticated) {
                elsa.App.navigateTo('/drawer');
            } else {
                $scope.error = 'Wrong username or password.';
                $scope.credentials = {};
            }
        });
    };

    $rootScope.logout = function() {
        $rootScope.authenticated = false;
        elsa.App.navigateTo('/login');
        nuxeo.clearNuxeoClient();
    };
}]);

angular.module("workspace-client-app").controller("notificationsCtrl", ['$scope', 'nuxeo', function($scope, nuxeo) {

    $scope.onStateChange = function(e) {
        var _this = this;
        nuxeo.getLogs("/default-domain", function(error, results) {
            if (!results) {
                _this.el.toast({
                    label: "No notifications!"
                });
                return;
            } else if (error) {
                _this.el.toast({
                    label: error
                });
            } else {
                $scope.$apply(function () {
                    $scope.logs = results;
                });
            }
        });
    };

}]);

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

angular.module("workspace-client-app").controller("workspaceCtrl", ['$scope', 'nuxeo', function($scope, nuxeo) {

    $scope.onStateChange = function(e) {
        //this executes whenever the state for this routable changes
        $scope.details = e.state;

        // Get files and folders within workspace
        nuxeo.getChildren('doc:/default-domain/workspaces/' + e.state.title, function(children) {
            if (children.length > 0) {
                $scope.$apply(function () {
                    $scope.isEmpty = false;
                    $scope.workspaceContents = children;
                });
            } else {
                $scope.$apply(function () {
                    $scope.isEmpty = true;
                });
            }
        });
    };
}]);

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

angular.module("workspace-client-app").factory("nuxeo", function() {

    var nuxeoClient;

    return {
        createNuxeoClient: function(credentials) {
            nuxeoClient = new window.nuxeo.Client({
                baseURL: window.sl.io.getRestUrl('nuxeo/'),
                auth: {
                    method: 'basic',
                    username: credentials.username,
                    password: credentials.password
                }
            });
        },

        clearNuxeoClient: function() {
            nuxeoClient = {};
        },

        connect: function(cb) {
            nuxeoClient.connect(cb);
        },

        getChildren: function(path, cb) {
            nuxeoClient.connect(function(error, client) {
                if (error) {
                    console.log("Error connecting: " + error.message);
                } else {
                    nuxeoClient.operation('Document.GetChildren').input(path).execute(function(error, children) {
                        if (error) {
                            console.log("Error fetching children: " + error.message);
                        } else {
                            // Filter deleted children
                            var validChildren = [];
                            for (var i = 0; i < children.entries.length; i++) {
                                if (children.entries[i].state !== "deleted") {
                                    validChildren.push(children.entries[i]);
                                }
                            }
                            cb(validChildren);
                        }
                    });
                }
            });
        },

        getLogs: function(path, cb) {
            nuxeoClient.connect(function(error, client) {
                if (error) {
                    console.log("Error connecting: " + error.message);
                } else {
                    nuxeoClient.request("path" + path + "/@audit")
                        .get(function(error, results) {
                        if (error || !results.entries) {
                          // something went wrong
                            cb(error);
                        } else {
                            cb(null, results.entries);
                        }
                    });
                }
            });
        }
    };
});
