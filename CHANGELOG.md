## [1.2.5](https://github.com/codemask-labs/stan-js/compare/v1.2.4...v1.2.5) (2024-06-19)


### Bug Fixes

* fix synchronizer detection ([22e7d0a](https://github.com/codemask-labs/stan-js/commit/22e7d0ae68abb6712e5dbc2072df806c99928e3c))
* remove fast-deep-equal ([#67](https://github.com/codemask-labs/stan-js/issues/67)) ([9342d0a](https://github.com/codemask-labs/stan-js/commit/9342d0abdd24a1beb6e4ba7c26491304a24168f3))

## [1.2.4](https://github.com/codemask-labs/stan-js/compare/v1.2.3...v1.2.4) (2024-06-14)


### Bug Fixes

* stop listening on MMKV changes to not create infinite loop ([22dc225](https://github.com/codemask-labs/stan-js/commit/22dc22585e00f5d8cb5c6b06a61dfa3b852bc18c))

## [1.2.3](https://github.com/codemask-labs/stan-js/compare/v1.2.2...v1.2.3) (2024-06-14)


### Bug Fixes

* publish non-minified code to npm ([fa6c4ae](https://github.com/codemask-labs/stan-js/commit/fa6c4ae884eea09f9b611e64847929a6a43d6043))

## [1.2.2](https://github.com/codemask-labs/stan-js/compare/v1.2.1...v1.2.2) (2024-05-28)


### Bug Fixes

* move subscribe to later ([47bbca5](https://github.com/codemask-labs/stan-js/commit/47bbca5daa20a690ecfd5528cc614a30053770fc))

## [1.2.1](https://github.com/codemask-labs/stan-js/compare/v1.2.0...v1.2.1) (2024-05-27)


### Bug Fixes

* fix reset when computed used, fix computed usage with synchronizer ([#65](https://github.com/codemask-labs/stan-js/issues/65)) ([53a456a](https://github.com/codemask-labs/stan-js/commit/53a456ac5d5d23df1ce6cd226dc75ba0414b0e64))

# [1.2.0](https://github.com/codemask-labs/stan-js/compare/v1.1.2...v1.2.0) (2024-05-24)


### Bug Fixes

* fix types ([b74e662](https://github.com/codemask-labs/stan-js/commit/b74e662e59363f0c5520ef2fd2e70e6523717795))


### Features

* add computed/derived state ([7958796](https://github.com/codemask-labs/stan-js/commit/7958796d4813a4c7cc9cda7b51f75d4cea491ee3))
* support removing data from storage ([#63](https://github.com/codemask-labs/stan-js/issues/63)) ([2040627](https://github.com/codemask-labs/stan-js/commit/2040627d10f87a63a9f5f03ffab1f5b5c1f21dbb))
* update syntax ([2496eb1](https://github.com/codemask-labs/stan-js/commit/2496eb15f7dfe661bab64ea6697f4ca79d08729d))

## [1.1.2](https://github.com/codemask-labs/stan-js/compare/v1.1.1...v1.1.2) (2024-05-16)


### Bug Fixes

* disable proxy after recalculate ([f0cfab2](https://github.com/codemask-labs/stan-js/commit/f0cfab21b0aba145ec0b4b51674351975db99863))

## [1.1.1](https://github.com/codemask-labs/stan-js/compare/v1.1.0...v1.1.1) (2024-05-15)


### Bug Fixes

* add peerDependenciesMeta ([66f5d98](https://github.com/codemask-labs/stan-js/commit/66f5d9808eb94f688d65c6735cc7dc776d3072d3))

# [1.1.0](https://github.com/codemask-labs/stan-js/compare/v1.0.1...v1.1.0) (2024-05-14)


### Bug Fixes

* js-docs ([f72f8a5](https://github.com/codemask-labs/stan-js/commit/f72f8a5150c8df6a31dd1edd9dde0aeb42f80b29))


### Features

* universal storage ([a172474](https://github.com/codemask-labs/stan-js/commit/a17247454cf37ec7f28c775324e8252f0f46df3f))

## [1.0.1](https://github.com/codemask-labs/stan-js/compare/v1.0.0...v1.0.1) (2024-05-14)


### Bug Fixes

* allow common js ([424baae](https://github.com/codemask-labs/stan-js/commit/424baae1c5f00c21df71c49baabb17bc1cada57e))

# 1.0.0 (2024-05-06)


### Bug Fixes

* action not passed to hook ([889dab2](https://github.com/codemask-labs/stan-js/commit/889dab29dcb2f73b7520d9032eb6c37c50b277d2))
* bun-version ([e7aa538](https://github.com/codemask-labs/stan-js/commit/e7aa538a17eb1f261910e287169744a919175f20))
* change lifecycle hook when husky is run ([d7c0198](https://github.com/codemask-labs/stan-js/commit/d7c019845eacf6cd9a3d636f580d9101f2b73e58))
* fix building ([614250f](https://github.com/codemask-labs/stan-js/commit/614250f7b707b0e666dc75b78ec0e838587b3d6c))
* fix reset for values with synchronizer ([7b7646d](https://github.com/codemask-labs/stan-js/commit/7b7646d6350013d4a1ab43ea16a5250c2ff1cd5a))
* fix reset helper types ([bf60554](https://github.com/codemask-labs/stan-js/commit/bf605544f904456ed69f3361f0344a96dcc7cf5b))
* fix tests ([c835e32](https://github.com/codemask-labs/stan-js/commit/c835e325095862b5d4654806fd81db2c09aab5f2))
* fix tests ([4201f1f](https://github.com/codemask-labs/stan-js/commit/4201f1f72b282d054ac5043355069d5d3f02c7d8))
* flatten state type ([4667824](https://github.com/codemask-labs/stan-js/commit/4667824d82f2211ccc554fcaea7f66d4973f4c17))
* improve types for partial state ([48e269d](https://github.com/codemask-labs/stan-js/commit/48e269d48e701d69d41e6b31434aeca6905949e1))
* infer nullable correctly ([46e38f7](https://github.com/codemask-labs/stan-js/commit/46e38f738f0e64348d10536af41506771505b058))
* missing script ([1dfcc22](https://github.com/codemask-labs/stan-js/commit/1dfcc2278cd1ce4a0d99bc29aa383de2f4152438))
* test ([068c7d1](https://github.com/codemask-labs/stan-js/commit/068c7d1b9db600c83f5a13aa09db44e20be86c20))
* test ([e6022bf](https://github.com/codemask-labs/stan-js/commit/e6022bffdab5ab255bf48350dd4886d3901a2c3d))
* tests ([3d748e7](https://github.com/codemask-labs/stan-js/commit/3d748e79d02f0716d2e177022b95402a695e5d50))
* tests ([1639115](https://github.com/codemask-labs/stan-js/commit/1639115028894b710a60e85920d98c4f7f159d4b))
* tests ([06ea326](https://github.com/codemask-labs/stan-js/commit/06ea326edc32b3ba6a5787ddb7772a79c7fa66fb))
* tests ([d94c36b](https://github.com/codemask-labs/stan-js/commit/d94c36bceb48544c6732b1d2a471ab0fb0ce8d18))
* tests ([f17b432](https://github.com/codemask-labs/stan-js/commit/f17b4324cdf53cfc89b010fef97b95736813ab5c))
* tests ([73d7567](https://github.com/codemask-labs/stan-js/commit/73d7567d427ae7d2342b9a0e69011485527774c9))
* tests ([396be0c](https://github.com/codemask-labs/stan-js/commit/396be0c40c7a00882725d73e3271a329c6e9437f))
* tests ([dc0da83](https://github.com/codemask-labs/stan-js/commit/dc0da839dce80d75cf74d8a08f7e0757d05b1f17))
* tests ([442a9d6](https://github.com/codemask-labs/stan-js/commit/442a9d69ff2ca6986902396104c964f7aa4232e3))
* types ([2508446](https://github.com/codemask-labs/stan-js/commit/2508446f83654c6b8172059dced8d8fc08c6f899))
* update readme ([a9e04c8](https://github.com/codemask-labs/stan-js/commit/a9e04c807d066e5efc152bd10b77f2531a020bb2))


### Features

* add compatibility for React <18 ([bdcfbca](https://github.com/codemask-labs/stan-js/commit/bdcfbca0179663757ba073b938cea989212b9e28))
* add createScopedStore ([61495b7](https://github.com/codemask-labs/stan-js/commit/61495b7618186e3b4e48b3dad4c957b2eb51f9a0))
* add custom serializers and deserializers to storage and mmkvStorage ([#54](https://github.com/codemask-labs/stan-js/issues/54)) ([661b744](https://github.com/codemask-labs/stan-js/commit/661b744425ff026ed2edfd371a6fc1071e8bc958))
* add resetting store ([1d4a76a](https://github.com/codemask-labs/stan-js/commit/1d4a76a9af42b80eff42b9931518c031e0a2107d))
* add test for HOC ([a4b1204](https://github.com/codemask-labs/stan-js/commit/a4b1204a4a04e347054820665c7bdf5be1a8cab4))
* added dprint and husky ([253d561](https://github.com/codemask-labs/stan-js/commit/253d561d719f0fe4c03c98aeb9ffc52c3211959b))
* added eslint with config ([c796400](https://github.com/codemask-labs/stan-js/commit/c796400cbb4c6077e4f8ca1951d1ed17b6d5cd40))
* allow for store ssr hydration ([9343f1b](https://github.com/codemask-labs/stan-js/commit/9343f1bbe05e474b566ecd6bd30f54a04879ee5e))
* change build method to unbuild ([7abf5bf](https://github.com/codemask-labs/stan-js/commit/7abf5bf3d6eda9b7a53720b2ab085900b8ee5e68))
* change synchronizer return types ([81eafc2](https://github.com/codemask-labs/stan-js/commit/81eafc2bec5d37a8b55658d55d5596f0294475f3))
* change yarn to bun and add tests ([3344fbb](https://github.com/codemask-labs/stan-js/commit/3344fbb235af534bcad0dc73f140333b7a78f599)), closes [#17](https://github.com/codemask-labs/stan-js/issues/17) [#9](https://github.com/codemask-labs/stan-js/issues/9)
* configure building ([a4b5564](https://github.com/codemask-labs/stan-js/commit/a4b55642e036147958a9ff3733fa06f684c127fa))
* create useStoreEffect hook ([9f6581c](https://github.com/codemask-labs/stan-js/commit/9f6581c996153aedc80b284df11cc1ba1fe9f87e))
* effect proxy ([ddd2729](https://github.com/codemask-labs/stan-js/commit/ddd27292d50561d5eb16a5a85c411af3b1e65f68))
* enhanced set action ([25a6d9b](https://github.com/codemask-labs/stan-js/commit/25a6d9b102a54c27d1c5a68bf5eb91ebf8f818cd))
* even more proxy and simpler api ([417b4c5](https://github.com/codemask-labs/stan-js/commit/417b4c5a9d8eb87c682a18df4fd607b5d13d7525))
* getAction improvements ([bd3b0fd](https://github.com/codemask-labs/stan-js/commit/bd3b0fd203c4667863f328321801c12c67cf6384))
* getAction improvements ([c3f9ac7](https://github.com/codemask-labs/stan-js/commit/c3f9ac7ed53e7997156318de43a3e404cfb1ea90))
* remove dispose function from synchronizer ([1e60758](https://github.com/codemask-labs/stan-js/commit/1e60758c9ec5b393c7e7955c7044791272b1e095))
* separate vanilla store ([eb4dc42](https://github.com/codemask-labs/stan-js/commit/eb4dc42de9b4847ca88a10b4ea8f86d1b7568078))
* separated synchronizers ([#49](https://github.com/codemask-labs/stan-js/issues/49)) ([14f6f72](https://github.com/codemask-labs/stan-js/commit/14f6f7265085c7f10dc74eea5515b06d25a40c10))
* update deps ([3bce9e4](https://github.com/codemask-labs/stan-js/commit/3bce9e44adf7ff4eca6f5c27feaaf9c791f7cdff))
* use parcel as bundler (Fixes [#13](https://github.com/codemask-labs/stan-js/issues/13)) ([7a32186](https://github.com/codemask-labs/stan-js/commit/7a32186d449e3d87e944ce1a1ffae2f80517b1b1))
* use proxy to subscribe for changes ([9b2a651](https://github.com/codemask-labs/stan-js/commit/9b2a65156d5f87d58db0d3e20c1c7c0d92849c42))

# [1.1.0](https://github.com/codemask-labs/store/compare/v1.0.1...v1.1.0) (2024-04-19)


### Features

* separated synchronizers ([#49](https://github.com/codemask-labs/store/issues/49)) ([14f6f72](https://github.com/codemask-labs/store/commit/14f6f7265085c7f10dc74eea5515b06d25a40c10))

## [1.0.1](https://github.com/codemaskinc/store/compare/v1.0.0...v1.0.1) (2024-04-04)


### Bug Fixes

* update readme ([a9e04c8](https://github.com/codemaskinc/store/commit/a9e04c807d066e5efc152bd10b77f2531a020bb2))

# 1.0.0 (2024-04-04)


### Bug Fixes

* action not passed to hook ([889dab2](https://github.com/codemaskinc/store/commit/889dab29dcb2f73b7520d9032eb6c37c50b277d2))
* bun-version ([e7aa538](https://github.com/codemaskinc/store/commit/e7aa538a17eb1f261910e287169744a919175f20))
* change lifecycle hook when husky is run ([d7c0198](https://github.com/codemaskinc/store/commit/d7c019845eacf6cd9a3d636f580d9101f2b73e58))
* fix building ([614250f](https://github.com/codemaskinc/store/commit/614250f7b707b0e666dc75b78ec0e838587b3d6c))
* fix reset for values with synchronizer ([7b7646d](https://github.com/codemaskinc/store/commit/7b7646d6350013d4a1ab43ea16a5250c2ff1cd5a))
* fix reset helper types ([bf60554](https://github.com/codemaskinc/store/commit/bf605544f904456ed69f3361f0344a96dcc7cf5b))
* fix tests ([c835e32](https://github.com/codemaskinc/store/commit/c835e325095862b5d4654806fd81db2c09aab5f2))
* fix tests ([4201f1f](https://github.com/codemaskinc/store/commit/4201f1f72b282d054ac5043355069d5d3f02c7d8))
* flatten state type ([4667824](https://github.com/codemaskinc/store/commit/4667824d82f2211ccc554fcaea7f66d4973f4c17))
* improve types for partial state ([48e269d](https://github.com/codemaskinc/store/commit/48e269d48e701d69d41e6b31434aeca6905949e1))
* infer nullable correctly ([46e38f7](https://github.com/codemaskinc/store/commit/46e38f738f0e64348d10536af41506771505b058))
* missing script ([1dfcc22](https://github.com/codemaskinc/store/commit/1dfcc2278cd1ce4a0d99bc29aa383de2f4152438))
* test ([068c7d1](https://github.com/codemaskinc/store/commit/068c7d1b9db600c83f5a13aa09db44e20be86c20))
* test ([e6022bf](https://github.com/codemaskinc/store/commit/e6022bffdab5ab255bf48350dd4886d3901a2c3d))
* tests ([3d748e7](https://github.com/codemaskinc/store/commit/3d748e79d02f0716d2e177022b95402a695e5d50))
* tests ([1639115](https://github.com/codemaskinc/store/commit/1639115028894b710a60e85920d98c4f7f159d4b))
* tests ([06ea326](https://github.com/codemaskinc/store/commit/06ea326edc32b3ba6a5787ddb7772a79c7fa66fb))
* tests ([d94c36b](https://github.com/codemaskinc/store/commit/d94c36bceb48544c6732b1d2a471ab0fb0ce8d18))
* tests ([f17b432](https://github.com/codemaskinc/store/commit/f17b4324cdf53cfc89b010fef97b95736813ab5c))
* tests ([73d7567](https://github.com/codemaskinc/store/commit/73d7567d427ae7d2342b9a0e69011485527774c9))
* tests ([396be0c](https://github.com/codemaskinc/store/commit/396be0c40c7a00882725d73e3271a329c6e9437f))
* tests ([dc0da83](https://github.com/codemaskinc/store/commit/dc0da839dce80d75cf74d8a08f7e0757d05b1f17))
* tests ([442a9d6](https://github.com/codemaskinc/store/commit/442a9d69ff2ca6986902396104c964f7aa4232e3))
* types ([2508446](https://github.com/codemaskinc/store/commit/2508446f83654c6b8172059dced8d8fc08c6f899))


### Features

* add compatibility for React <18 ([bdcfbca](https://github.com/codemaskinc/store/commit/bdcfbca0179663757ba073b938cea989212b9e28))
* add createScopedStore ([61495b7](https://github.com/codemaskinc/store/commit/61495b7618186e3b4e48b3dad4c957b2eb51f9a0))
* add resetting store ([1d4a76a](https://github.com/codemaskinc/store/commit/1d4a76a9af42b80eff42b9931518c031e0a2107d))
* add test for HOC ([a4b1204](https://github.com/codemaskinc/store/commit/a4b1204a4a04e347054820665c7bdf5be1a8cab4))
* added dprint and husky ([253d561](https://github.com/codemaskinc/store/commit/253d561d719f0fe4c03c98aeb9ffc52c3211959b))
* added eslint with config ([c796400](https://github.com/codemaskinc/store/commit/c796400cbb4c6077e4f8ca1951d1ed17b6d5cd40))
* allow for store ssr hydration ([9343f1b](https://github.com/codemaskinc/store/commit/9343f1bbe05e474b566ecd6bd30f54a04879ee5e))
* change synchronizer return types ([81eafc2](https://github.com/codemaskinc/store/commit/81eafc2bec5d37a8b55658d55d5596f0294475f3))
* change yarn to bun and add tests ([3344fbb](https://github.com/codemaskinc/store/commit/3344fbb235af534bcad0dc73f140333b7a78f599)), closes [#17](https://github.com/codemaskinc/store/issues/17) [#9](https://github.com/codemaskinc/store/issues/9)
* configure building ([a4b5564](https://github.com/codemaskinc/store/commit/a4b55642e036147958a9ff3733fa06f684c127fa))
* create useStoreEffect hook ([9f6581c](https://github.com/codemaskinc/store/commit/9f6581c996153aedc80b284df11cc1ba1fe9f87e))
* enhanced set action ([25a6d9b](https://github.com/codemaskinc/store/commit/25a6d9b102a54c27d1c5a68bf5eb91ebf8f818cd))
* getAction improvements ([bd3b0fd](https://github.com/codemaskinc/store/commit/bd3b0fd203c4667863f328321801c12c67cf6384))
* getAction improvements ([c3f9ac7](https://github.com/codemaskinc/store/commit/c3f9ac7ed53e7997156318de43a3e404cfb1ea90))
* remove dispose function from synchronizer ([1e60758](https://github.com/codemaskinc/store/commit/1e60758c9ec5b393c7e7955c7044791272b1e095))
* update deps ([3bce9e4](https://github.com/codemaskinc/store/commit/3bce9e44adf7ff4eca6f5c27feaaf9c791f7cdff))
* use parcel as bundler (Fixes [#13](https://github.com/codemaskinc/store/issues/13)) ([7a32186](https://github.com/codemaskinc/store/commit/7a32186d449e3d87e944ce1a1ffae2f80517b1b1))
* use proxy to subscribe for changes ([9b2a651](https://github.com/codemaskinc/store/commit/9b2a65156d5f87d58db0d3e20c1c7c0d92849c42))
