require.module('user_alt/admin/index.js', function(module, exports, require) {
// start module: user_alt/admin/index.js

module.exports = "admin"

// end module: user_alt/admin/index.js
});
;

require.module('user_alt/index.js', function(module, exports, require) {
// start module: user_alt/index.js

module.exports = require("./admin")

// end module: user_alt/index.js
});
;

