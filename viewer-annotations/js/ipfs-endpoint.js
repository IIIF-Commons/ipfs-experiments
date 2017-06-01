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
      annotation["@id"] = Mirador.genUUID();
      delete(annotation.endpoint);
      _this.db.pushResource(Object.assign({}, annotation));
      annotation.fullId = annotation["@id"];
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
