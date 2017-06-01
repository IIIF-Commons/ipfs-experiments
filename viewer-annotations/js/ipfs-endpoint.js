ipfsEndpoint = function(ipfsDbInstance) {

  IpfsEndpoint = function(options) {
    this.db = ipfsDbInstance;
    this.annotationsList = null; // will be set to results per page
    this.dfd = options.dfd;
  };

  IpfsEndpoint.prototype = {
    search: function(options) {
      var _this = this;
      console.log('search called');
      console.log(options);
      console.log(_this.db);
      console.log(_this.db.toJSON());
      _this.annotationsList = _this.db.toJSON()
        .resources.filter(function(annotation) {
          annotation.fullId = annotation["@id"];
          annotation["@id"] = Mirador.genUUID();
          annotation.endpoint = _this;
          console.log(annotation.on[0].full);
          console.log(annotation.on[0].full == options.uri);
          return annotation.on[0].full == options.uri;
        });
      _this.dfd.resolve(false);
    },
    deleteAnnotation: function(annotationID, sucessCallback, errorCallback) {
      var _this = this;
      console.log('delete called');
      console.log(annotationID);
      console.log(
        _this.db.getResources().map(function(resource) {
          return resource['@id'];
        }).indexOf(annotationID)
      );
      _this.db.deleteResourceAt(
        _this.db.getResources().map(function(resource) {
          return resource.id;
        }).indexOf(annotationID)
      );
      sucessCallback();
    },
    update: function(annotationID, sucessCallback, errorCallback) {
      console.log('update called');
    },
    create: function(annotation, successCallback) {
      var _this = this;
      console.log('create called');
      console.log(annotation);
      delete(annotation.endpoint);
      console.log(annotation);
      _this.db.pushResource(annotation);
      annotation.fullId = annotation["@id"];
      annotation["@id"] = Mirador.genUUID();
      annotation.endpoint = _this;
      successCallback(annotation);
    },
    set: function(prop, value, options) {
      if (options) {
        this[options.parent][prop] = value;
      } else {
        this[prop] = value;
      }
    },
    userAuthorize: function() {
      return true;
    }
  };

  return IpfsEndpoint;
};

// ipfsEndpoint = function(ipfsDbInstance) {
//     jQuery.extend(this, {
//       token:     null,
//       uri:      null,
//       url:        options.url,
//       dfd:       null,
//       annotationsList: [],        //OA list for Mirador use
//       idMapper: {} // internal list for module use to map id to URI
//     }, options);
//     this.init();
//   };
//   $.SimpleASEndpoint.prototype = {
//     //Any set up for this endpoint, and triggers a search of the URI passed to object
//     init: function() {
//     },
//     //Search endpoint for all annotations with a given URI
//     search: function(options, successCallback, errorCallback) {
//       console.log(options);
//       var _this = this;
//       this.annotationsList = []; //clear out current list
//       jQuery.ajax({
//         url: _this.url + "/search", // this.prefix+
//         cache: false,
//         type: 'GET',
//         dataType: 'json',
//         headers: {
//           //"x-annotator-auth-token": this.token
//         },
//         data: {
//           uri: options.uri,
//           APIKey: _this.APIKey,
//           media: "image",
//           limit: 10000
//         },
//         contentType: "application/json; charset=utf-8",
//         success: function(data) {
//           if (typeof successCallback === "function") {
//             successCallback(data);
//           } else {
//             _this.annotationsList = data; // gmr
//             jQuery.each(_this.annotationsList, function(index, value) {
//               value.fullId = value["@id"];
//               value["@id"] = $.genUUID();
//               _this.idMapper[value["@id"]] = value.fullId;
//               value.endpoint = _this;
//             });
//             _this.dfd.resolve(false);
//           }
//         },
//         error: function() {
//           if (typeof errorCallback === "function") {
//             errorCallback();
//           } else {
//             console.log("The request for annotations has caused an error for endpoint: "+ options.uri);
//           }
//         }
//       });
//     },
//     deleteAnnotation: function(annotationID, returnSuccess, returnError) {
//       var _this = this;
//       jQuery.ajax({
//         url: _this.url + "/destroy?uri=" + encodeURIComponent(_this.idMapper[annotationID]) + "&APIKey=" + _this.APIKey, // this.prefix+
//         type: 'DELETE',
//         dataType: 'json',
//         headers: {
//           //"x-annotator-auth-token": this.token
//         },
//         data: {
//           uri: annotationID,
//         },
//         contentType: "application/json; charset=utf-8",
//         success: function(data) {
//           returnSuccess();
//         },
//         error: function() {
//           returnError();
//         }
//       });
//     },
//     update: function(oaAnnotation, returnSuccess, returnError) {
//       var annotation = oaAnnotation,
//           _this = this;
//       // slashes don't work in JQuery.find which is used for delete
//       // so need to switch http:// id to full id and back again for delete.
//       shortId = annotation["@id"];
//       annotation["@id"] = annotation.fullId;
//       annotationID = annotation.fullId;//annotation["@id"];
//       delete annotation.fullId;
//       delete annotation.endpoint;
//       jQuery.ajax({
//         url: _this.url + "/update/"+encodeURIComponent(annotationID) + "?APIKey=" + _this.APIKey, //this.prefix+
//         type: 'POST',
//         dataType: 'json',
//         headers: {
//           //"x-annotator-auth-token": this.token
//         },
//         data: JSON.stringify(annotation),
//         contentType: "application/json; charset=utf-8",
//         success: function(data) {
//           /* this returned data doesn't seem to be used anywhere */
//           returnSuccess();
//         },
//         error: function() {
//           returnError();
//         }
//       });
//       // this is what updates the viewer
//       annotation.endpoint = _this;
//       annotation.fullId = annotation["@id"];
//       annotation["@id"] = shortId;
//     },
//     create: function(oaAnnotation, returnSuccess, returnError) {
//       var annotation = oaAnnotation,
//           _this = this;
//       jQuery.ajax({
//         url: _this.url + "/create?APIKey=" + _this.APIKey, //this.prefix+
//         type: 'POST',
//         dataType: 'json',
//         headers: {
//           //"x-annotator-auth-token": this.token
//         },
//         data: JSON.stringify(annotation),
//         contentType: "application/json; charset=utf-8",
//         success: function(data) {
//           data.fullId = data["@id"];
//           data["@id"] = $.genUUID();
//           data.endpoint = _this;
//           _this.idMapper[data["@id"]] = data.fullId;
//           returnSuccess(data);
//         },
//         error: function() {
//           returnError();
//         }
//       });
//     },
//     set: function(prop, value, options) {
//       if (options) {
//         this[options.parent][prop] = value;
//       } else {
//         this[prop] = value;
//       }
//     },
//     userAuthorize: function(action, annotation) {
//       return true; // allow all
//     }
//   };
// }(Mirador));
