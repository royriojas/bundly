
# bundly - Changelog
## v5.1.0
- **Enhancements**
  - Add neverCache option and make the cache to be recreated when options change - [6c89456]( https://github.com/royriojas/bundly/commit/6c89456 ), [royriojas](https://github.com/royriojas), 22/09/2015 02:43:01

    
## v5.0.0
- **Enhancements**
  - transforms are not longer specified by bundly, it is just a wrapper over persistify - [b4b6b8f]( https://github.com/royriojas/bundly/commit/b4b6b8f ), [royriojas](https://github.com/royriojas), 20/09/2015 11:49:48

    
  - Update simplessy version to support css modules - [7d88ebb]( https://github.com/royriojas/bundly/commit/7d88ebb ), [royriojas](https://github.com/royriojas), 18/09/2015 11:34:35

    
## v4.2.3
- **Bug Fixes**
  - Make sure deleted modules are not kept in browserify cache - [0e3b184]( https://github.com/royriojas/bundly/commit/0e3b184 ), [royriojas](https://github.com/royriojas), 04/09/2015 15:18:25

    
## v4.2.2
- **Bug Fixes**
  - Handle transforms that are plain functions - [1166aff]( https://github.com/royriojas/bundly/commit/1166aff ), [Roy Riojas](https://github.com/Roy Riojas), 31/08/2015 05:49:51

    
## v4.2.1
- **Build Scripts Changes**
  - Update simplessy to obtain scoped modules - [d87537a]( https://github.com/royriojas/bundly/commit/d87537a ), [Roy Riojas](https://github.com/Roy Riojas), 31/08/2015 05:25:26

    
## v4.2.0
- **Refactoring**
  - move simplessy to its own module - [8f78e0b]( https://github.com/royriojas/bundly/commit/8f78e0b ), [royriojas](https://github.com/royriojas), 27/08/2015 03:44:22

    
## v4.1.0
- **Refactoring**
  - move dot-ify to its own module - [1880386]( https://github.com/royriojas/bundly/commit/1880386 ), [royriojas](https://github.com/royriojas), 26/08/2015 20:27:28

    
## v4.0.1
- **Bug Fixes**
  - make sure each bundler instance has an id to prevent it from messing with the file cache - [905d7b9]( https://github.com/royriojas/bundly/commit/905d7b9 ), [royriojas](https://github.com/royriojas), 24/08/2015 17:28:05

    
## v4.0.0
- **Features**
  - Use persitify to clearly manage the persistence of the cache - [690cd54]( https://github.com/royriojas/bundly/commit/690cd54 ), [Roy Riojas](https://github.com/Roy Riojas), 24/08/2015 05:03:42

    
## v3.0.6
- **Bug Fixes**
  - setting the cache to false from the config should destroy the cache - [194bf1c]( https://github.com/royriojas/bundly/commit/194bf1c ), [Roy Riojas](https://github.com/Roy Riojas), 23/08/2015 06:53:40

    
## v3.0.5
- **Build Scripts Changes**
  - Update clix to obtain `ext` and `rename` options - [2513386]( https://github.com/royriojas/bundly/commit/2513386 ), [Roy Riojas](https://github.com/Roy Riojas), 21/08/2015 03:44:53

    
## v3.0.4
- **Build Scripts Changes**
  - include latest clix to fix issue expanding mappings - [5d1c9e3]( https://github.com/royriojas/bundly/commit/5d1c9e3 ), [Roy Riojas](https://github.com/Roy Riojas), 21/08/2015 01:20:21

    
## v3.0.3
- **Enhancements**
  - properly handle case when no parameters are provided - [9dc21b5]( https://github.com/royriojas/bundly/commit/9dc21b5 ), [royriojas](https://github.com/royriojas), 17/08/2015 04:04:15

    
## v3.0.2
- **Features**
  - use green color for the messages of files created - [a979b1a]( https://github.com/royriojas/bundly/commit/a979b1a ), [royriojas](https://github.com/royriojas), 16/08/2015 20:59:01

    
## v3.0.1
- **Features**
  - properly throw an exception from the catch handler - [6284d2a]( https://github.com/royriojas/bundly/commit/6284d2a ), [royriojas](https://github.com/royriojas), 16/08/2015 16:48:49

    
## v3.0.0
- **Features**
  - Run tasks using clix.getTargets, similar to how grunt run its tasks - [e4cbe97]( https://github.com/royriojas/bundly/commit/e4cbe97 ), [royriojas](https://github.com/royriojas), 16/08/2015 05:11:15

    
## v2.1.8
- **Refactoring**
  - use more verbose logs - [70a0bb2]( https://github.com/royriojas/bundly/commit/70a0bb2 ), [royriojas](https://github.com/royriojas), 13/08/2015 01:27:21

    
## v2.1.7
- **Build Scripts Changes**
  - update clix dep to get nicer log output - [06d1bf6]( https://github.com/royriojas/bundly/commit/06d1bf6 ), [royriojas](https://github.com/royriojas), 11/08/2015 19:33:13

    
## v2.1.6
- **Bug Fixes**
  - add error handler - [885a41a]( https://github.com/royriojas/bundly/commit/885a41a ), [royriojas](https://github.com/royriojas), 11/08/2015 14:07:21

    
## v2.1.5
- **Bug Fixes**
  - grunt task wrong path to index module - [46cadc4]( https://github.com/royriojas/bundly/commit/46cadc4 ), [royriojas](https://github.com/royriojas), 11/08/2015 13:59:04

    
## v2.1.4
- **Bug Fixes**
  - Add missing clix-logger module - [9bbbe6f]( https://github.com/royriojas/bundly/commit/9bbbe6f ), [royriojas](https://github.com/royriojas), 11/08/2015 13:50:50

    
## v2.1.3
- **Features**
  - Add grunt task - [812b1b3]( https://github.com/royriojas/bundly/commit/812b1b3 ), [royriojas](https://github.com/royriojas), 10/08/2015 02:03:03

    
## v2.1.2
- **Build Scripts Changes**
  - update to latest simpless to fix bug in write dep - [455f2e0]( https://github.com/royriojas/bundly/commit/455f2e0 ), [royriojas](https://github.com/royriojas), 09/08/2015 21:20:48

    
## v2.1.1
- **Build Scripts Changes**
  - update to latest simpless to fix bug in read-file dep - [a39f139]( https://github.com/royriojas/bundly/commit/a39f139 ), [royriojas](https://github.com/royriojas), 09/08/2015 21:17:28

    
## v2.1.0
- **Build Scripts Changes**
  - Update pkg deps and build scripts - [b7f82c9]( https://github.com/royriojas/bundly/commit/b7f82c9 ), [royriojas](https://github.com/royriojas), 09/08/2015 20:33:17

    
## v2.0.8
- **Features**
  - `beforeTransforms` and `afterTransforms` - [de7b2b2]( https://github.com/royriojas/bundly/commit/de7b2b2 ), [royriojas](https://github.com/royriojas), 20/07/2015 03:33:48

    
## v2.0.7
- **Bug Fixes**
  - add back the separator option removed by mistake - [02e67cf]( https://github.com/royriojas/bundly/commit/02e67cf ), [royriojas](https://github.com/royriojas), 19/07/2015 09:15:30

    
## v2.0.6
- **Bug Fixes**
  - remove excludeExtensions from babelify - [aae15d6]( https://github.com/royriojas/bundly/commit/aae15d6 ), [royriojas](https://github.com/royriojas), 19/07/2015 08:57:37

    
## v2.0.5
- **Bug Fixes**
  - wrong trasnform name for simplessy - [a9bfad2]( https://github.com/royriojas/bundly/commit/a9bfad2 ), [royriojas](https://github.com/royriojas), 19/07/2015 08:50:22

    
## v2.0.4
- **Build Scripts Changes**
  - Update browserify transforms deps - [f60610e]( https://github.com/royriojas/bundly/commit/f60610e ), [royriojas](https://github.com/royriojas), 19/07/2015 08:30:55

    
## v2.0.3
- **Bug Fixes**
  - include only the files of the type this transform will be applied to - [7116a13]( https://github.com/royriojas/bundly/commit/7116a13 ), [royriojas](https://github.com/royriojas), 19/07/2015 08:18:41

    
## v2.0.2
- **Bug Fixes**
  - properly extend the shims dependencies config - [986bf47]( https://github.com/royriojas/bundly/commit/986bf47 ), [royriojas](https://github.com/royriojas), 19/07/2015 08:06:42

    
## v2.0.1
- **Documentation**
  - Update Readme to match the latest configuration (cache is on by default) - [13b4a8f]( https://github.com/royriojas/bundly/commit/13b4a8f ), [royriojas](https://github.com/royriojas), 19/07/2015 07:02:24

    
## v2.0.0
- **Refactoring**
  - normalize the transforms configuration and names, remove the unused and rename some config options - [73e80be]( https://github.com/royriojas/bundly/commit/73e80be ), [royriojas](https://github.com/royriojas), 19/07/2015 06:56:48

    
#### transforms
- **Enhancements**
  - better management of the transforms that are included - [e3d6c92]( https://github.com/royriojas/bundly/commit/e3d6c92 ), [royriojas](https://github.com/royriojas), 17/07/2015 21:38:08

    
## v1.1.6
- **Bug Fixes**
  - fix the compile to less transform that uses simpless - [cafe30b]( https://github.com/royriojas/bundly/commit/cafe30b ), [royriojas](https://github.com/royriojas), 13/07/2015 03:44:10

    
## v1.1.5
- **Build Scripts Changes**
  - Update simpless dep to get the fix for wrong reporting of errors in required files - [395d494]( https://github.com/royriojas/bundly/commit/395d494 ), [royriojas](https://github.com/royriojas), 13/07/2015 02:17:50

    
## v1.1.4
- **Enhancements**
  - Cache is now enabled by default. - [3ee0e31]( https://github.com/royriojas/bundly/commit/3ee0e31 ), [royriojas](https://github.com/royriojas), 12/07/2015 18:03:20

    In order to clear the cache. Run bundly with cache false
    
    ```bash
    bundly -u false file.js -o output.js
    ```
    
## v1.1.3
- **Build Scripts Changes**
  - activating the incremental build by default (`use-cache` is true by default now) - [295d82f]( https://github.com/royriojas/bundly/commit/295d82f ), [royriojas](https://github.com/royriojas), 11/07/2015 19:51:50

    
## v1.1.2
- **Bug Fixes**
  - Add missing modules - [36699bd]( https://github.com/royriojas/bundly/commit/36699bd ), [royriojas](https://github.com/royriojas), 09/07/2015 01:10:16

    
## v1.1.1
- **Documentation**
  - Update Readme to add an example of how to use this module - [8f2ced3]( https://github.com/royriojas/bundly/commit/8f2ced3 ), [royriojas](https://github.com/royriojas), 08/07/2015 00:54:02

    
## v1.1.0
- **Build Scripts Changes**
  - Add changelog generation script - [7b4a16b]( https://github.com/royriojas/bundly/commit/7b4a16b ), [royriojas](https://github.com/royriojas), 08/07/2015 00:13:08

    
## v1.0.0
- **Features**
  - First working version of bundly - [dd7c26e]( https://github.com/royriojas/bundly/commit/dd7c26e ), [royriojas](https://github.com/royriojas), 08/07/2015 00:11:32

    
