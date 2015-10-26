var bedrock = GLOBAL.bedrock;
var should = GLOBAL.should;
var describe = GLOBAL.describe;
var it = GLOBAL.it;

describe('accept-credential-directive', function() {
  beforeEach(function() {
    bedrock.waitForAngular();
  });

  it('should do anything', function() {
    (bedrock.run(function($injector) {
      // var acd = $injector.get('credentialService');
      return $injector.has('brCredentialService');
    })).should.eventually.be.true;
  });

});
