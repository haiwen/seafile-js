PROJECT=seafile-js

eslint-test:
	node_modules/.bin/eslint test/test.js
	@echo "\033[32;36m test.js eslint test success \033[0m"
	node_modules/.bin/eslint src/seafile-api.js
	@echo "\033[32;36m seafile-api.js eslint test success \033[0m"
