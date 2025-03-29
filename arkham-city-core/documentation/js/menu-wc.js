'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">arkham-city-core documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"' : 'data-bs-target="#xs-injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"' :
                                        'id="xs-injectables-links-module-CoreModule-d3e47798492dc21aa408898a13662e87d285aa5cc26d9f64e5965406e18f0b4f56fb87ab7433ab4e975ef25aac3cc628524c3b3c83cd314a3a5bcfbc86ba8b0c"' }>
                                        <li class="link">
                                            <a href="injectables/HashService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HashService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GatewayModule.html" data-type="entity-link" >GatewayModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GatewayModule-e79732960ce295fd993815e91065c8eabffb4176f0d8621b7c487d4ba17bda6b29817f26ae7f1134fab9f833c548527542cd95a5581d49b01c58c0545bbadfe3"' : 'data-bs-target="#xs-controllers-links-module-GatewayModule-e79732960ce295fd993815e91065c8eabffb4176f0d8621b7c487d4ba17bda6b29817f26ae7f1134fab9f833c548527542cd95a5581d49b01c58c0545bbadfe3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GatewayModule-e79732960ce295fd993815e91065c8eabffb4176f0d8621b7c487d4ba17bda6b29817f26ae7f1134fab9f833c548527542cd95a5581d49b01c58c0545bbadfe3"' :
                                            'id="xs-controllers-links-module-GatewayModule-e79732960ce295fd993815e91065c8eabffb4176f0d8621b7c487d4ba17bda6b29817f26ae7f1134fab9f833c548527542cd95a5581d49b01c58c0545bbadfe3"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/FirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/TestController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TestController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MicroservicesModule.html" data-type="entity-link" >MicroservicesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MicroservicesModule-74f5d77ed4518976924edfd10ff04a3c4d1489fd79f1fdb97f4305ee57a81499b4b36787af75e96745f638a190f6aa609257343f826694d492f839188d7b486a"' : 'data-bs-target="#xs-controllers-links-module-MicroservicesModule-74f5d77ed4518976924edfd10ff04a3c4d1489fd79f1fdb97f4305ee57a81499b4b36787af75e96745f638a190f6aa609257343f826694d492f839188d7b486a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MicroservicesModule-74f5d77ed4518976924edfd10ff04a3c4d1489fd79f1fdb97f4305ee57a81499b4b36787af75e96745f638a190f6aa609257343f826694d492f839188d7b486a"' :
                                            'id="xs-controllers-links-module-MicroservicesModule-74f5d77ed4518976924edfd10ff04a3c4d1489fd79f1fdb97f4305ee57a81499b4b36787af75e96745f638a190f6aa609257343f826694d492f839188d7b486a"' }>
                                            <li class="link">
                                                <a href="controllers/FirestoreController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ModulesModule.html" data-type="entity-link" >ModulesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ModulesModule-518af765c1e10881121315070c1fa691863c413b39dc472fa9df7b687f060a5fbc92fb1b2e6359891e2af1079c25d96e35bd5776ac55105b64728bbd9b631a2f"' : 'data-bs-target="#xs-injectables-links-module-ModulesModule-518af765c1e10881121315070c1fa691863c413b39dc472fa9df7b687f060a5fbc92fb1b2e6359891e2af1079c25d96e35bd5776ac55105b64728bbd9b631a2f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ModulesModule-518af765c1e10881121315070c1fa691863c413b39dc472fa9df7b687f060a5fbc92fb1b2e6359891e2af1079c25d96e35bd5776ac55105b64728bbd9b631a2f"' :
                                        'id="xs-injectables-links-module-ModulesModule-518af765c1e10881121315070c1fa691863c413b39dc472fa9df7b687f060a5fbc92fb1b2e6359891e2af1079c25d96e35bd5776ac55105b64728bbd9b631a2f"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FirestoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HashService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HashService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MongooseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MongooseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/StorageController.html" data-type="entity-link" >StorageController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuditEntity.html" data-type="entity-link" >AuditEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadMicroserviceResponse.html" data-type="entity-link" >BadMicroserviceResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadRequestAlertException.html" data-type="entity-link" >BadRequestAlertException</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseService.html" data-type="entity-link" >BaseService</a>
                            </li>
                            <li class="link">
                                <a href="classes/DynamicSchema.html" data-type="entity-link" >DynamicSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/Field.html" data-type="entity-link" >Field</a>
                            </li>
                            <li class="link">
                                <a href="classes/GatewayController.html" data-type="entity-link" >GatewayController</a>
                            </li>
                            <li class="link">
                                <a href="classes/GlobalFilter.html" data-type="entity-link" >GlobalFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Project.html" data-type="entity-link" >Project</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessMicroserviceResponse.html" data-type="entity-link" >SuccessMicroserviceResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ExceptionInterceptor.html" data-type="entity-link" >ExceptionInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponseInterceptor.html" data-type="entity-link" >ResponseInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreateFirestoreRecord.html" data-type="entity-link" >CreateFirestoreRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JWTPayload.html" data-type="entity-link" >JWTPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogInByEmailAndPassword.html" data-type="entity-link" >LogInByEmailAndPassword</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogInByRefreshToken.html" data-type="entity-link" >LogInByRefreshToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogInResponseDto.html" data-type="entity-link" >LogInResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicroserviceResponse.html" data-type="entity-link" >MicroserviceResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterByEmailAndPasswordDto.html" data-type="entity-link" >RegisterByEmailAndPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterResponseDto.html" data-type="entity-link" >RegisterResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResponseDto.html" data-type="entity-link" >ResponseDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});