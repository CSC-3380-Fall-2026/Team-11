import type * as gax from 'google-gax';
import type { Callback, CallOptions, Descriptors, ClientOptions, LocationsClient, LocationProtos } from 'google-gax';
import * as protos from '../../protos/protos';
/**
 * @class
 * @memberof v1
 */
export declare class SqlInstancesServiceClient {
    private _terminated;
    private _opts;
    private _providedCustomServicePath;
    private _gaxModule;
    private _gaxGrpc;
    private _protos;
    private _defaults;
    private _universeDomain;
    private _servicePath;
    private _log;
    auth: gax.GoogleAuth;
    descriptors: Descriptors;
    warn: (code: string, message: string, warnType?: string) => void;
    innerApiCalls: {
        [name: string]: Function;
    };
    locationsClient: LocationsClient;
    pathTemplates: {
        [name: string]: gax.PathTemplate;
    };
    sqlInstancesServiceStub?: Promise<{
        [name: string]: Function;
    }>;
    /**
     * Construct an instance of SqlInstancesServiceClient.
     *
     * @param {object} [options] - The configuration object.
     * The options accepted by the constructor are described in detail
     * in [this document](https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#creating-the-client-instance).
     * The common options are:
     * @param {object} [options.credentials] - Credentials object.
     * @param {string} [options.credentials.client_email]
     * @param {string} [options.credentials.private_key]
     * @param {string} [options.email] - Account email address. Required when
     *     using a .pem or .p12 keyFilename.
     * @param {string} [options.keyFilename] - Full path to the a .json, .pem, or
     *     .p12 key downloaded from the Google Developers Console. If you provide
     *     a path to a JSON file, the projectId option below is not necessary.
     *     NOTE: .pem and .p12 require you to specify options.email as well.
     * @param {number} [options.port] - The port on which to connect to
     *     the remote host.
     * @param {string} [options.projectId] - The project ID from the Google
     *     Developer's Console, e.g. 'grape-spaceship-123'. We will also check
     *     the environment variable GCLOUD_PROJECT for your project ID. If your
     *     app is running in an environment which supports
     *     {@link https://cloud.google.com/docs/authentication/application-default-credentials Application Default Credentials},
     *     your project ID will be detected automatically.
     * @param {string} [options.apiEndpoint] - The domain name of the
     *     API remote host.
     * @param {gax.ClientConfig} [options.clientConfig] - Client configuration override.
     *     Follows the structure of {@link gapicConfig}.
     * @param {boolean} [options.fallback] - Use HTTP/1.1 REST mode.
     *     For more information, please check the
     *     {@link https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#http11-rest-api-mode documentation}.
     * @param {gax} [gaxInstance]: loaded instance of `google-gax`. Useful if you
     *     need to avoid loading the default gRPC version and want to use the fallback
     *     HTTP implementation. Load only fallback version and pass it to the constructor:
     *     ```
     *     const gax = require('google-gax/build/src/fallback'); // avoids loading google-gax with gRPC
     *     const client = new SqlInstancesServiceClient({fallback: true}, gax);
     *     ```
     */
    constructor(opts?: ClientOptions, gaxInstance?: typeof gax | typeof gax.fallback);
    /**
     * Initialize the client.
     * Performs asynchronous operations (such as authentication) and prepares the client.
     * This function will be called automatically when any class method is called for the
     * first time, but if you need to initialize it before calling an actual method,
     * feel free to call initialize() directly.
     *
     * You can await on this method if you want to make sure the client is initialized.
     *
     * @returns {Promise} A promise that resolves to an authenticated service stub.
     */
    initialize(): Promise<{
        [name: string]: Function;
    }>;
    /**
     * The DNS address for this API service.
     * @deprecated Use the apiEndpoint method of the client instance.
     * @returns {string} The DNS address for this service.
     */
    static get servicePath(): string;
    /**
     * The DNS address for this API service - same as servicePath.
     * @deprecated Use the apiEndpoint method of the client instance.
     * @returns {string} The DNS address for this service.
     */
    static get apiEndpoint(): string;
    /**
     * The DNS address for this API service.
     * @returns {string} The DNS address for this service.
     */
    get apiEndpoint(): string;
    get universeDomain(): string;
    /**
     * The port for this API service.
     * @returns {number} The default port for this service.
     */
    static get port(): number;
    /**
     * The scopes needed to make gRPC calls for every method defined
     * in this service.
     * @returns {string[]} List of default scopes.
     */
    static get scopes(): string[];
    getProjectId(): Promise<string>;
    getProjectId(callback: Callback<string, undefined, undefined>): void;
    /**
     * Adds a new trusted Certificate Authority (CA) version for the specified
     * instance. Required to prepare for a certificate rotation. If a CA version
     * was previously added but never used in a certificate rotation, this
     * operation replaces that version. There cannot be more than one CA version
     * waiting to be rotated in. For instances that have enabled Certificate
     * Authority Service (CAS) based server CA, use AddServerCertificate to add a
     * new server certificate.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.add_server_ca.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_AddServerCa_async
     */
    addServerCa(request?: protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest | undefined,
        {} | undefined
    ]>;
    addServerCa(request: protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest | null | undefined, {} | null | undefined>): void;
    addServerCa(request: protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddServerCaRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Add a new trusted server certificate version for the specified instance
     * using Certificate Authority Service (CAS) server CA. Required to prepare
     * for a certificate rotation. If a server certificate version was previously
     * added but never used in a certificate rotation, this operation replaces
     * that version. There cannot be more than one certificate version waiting to
     * be rotated in. For instances not using CAS server CA, use AddServerCa
     * instead.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.add_server_certificate.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_AddServerCertificate_async
     */
    addServerCertificate(request?: protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest | undefined),
        {} | undefined
    ]>;
    addServerCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest | null | undefined, {} | null | undefined>): void;
    addServerCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddServerCertificateRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Adds a new Entra ID certificate for the specified instance. If an Entra ID
     * certificate was previously added but never used in a certificate rotation,
     * this operation replaces that version.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.add_entra_id_certificate.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_AddEntraIdCertificate_async
     */
    addEntraIdCertificate(request?: protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest | undefined),
        {} | undefined
    ]>;
    addEntraIdCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest | null | undefined, {} | null | undefined>): void;
    addEntraIdCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesAddEntraIdCertificateRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Creates a Cloud SQL instance as a clone of the source instance. Using this
     * operation might cause your instance to restart.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. The ID of the Cloud SQL instance to be cloned (source). This does
     *   not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the source Cloud SQL instance.
     * @param {google.cloud.sql.v1.InstancesCloneRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.clone.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Clone_async
     */
    clone(request?: protos.google.cloud.sql.v1.ISqlInstancesCloneRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesCloneRequest | undefined,
        {} | undefined
    ]>;
    clone(request: protos.google.cloud.sql.v1.ISqlInstancesCloneRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesCloneRequest | null | undefined, {} | null | undefined>): void;
    clone(request: protos.google.cloud.sql.v1.ISqlInstancesCloneRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesCloneRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Deletes a Cloud SQL instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance to be deleted.
     * @param {boolean} request.enableFinalBackup
     *   Flag to opt-in for final backup. By default, it is turned off.
     * @param {number} [request.finalBackupTtlDays]
     *   Optional. Retention period of the final backup.
     * @param {google.protobuf.Timestamp} [request.finalBackupExpiryTime]
     *   Optional. Final Backup expiration time.
     *   Timestamp in UTC of when this resource is considered expired.
     * @param {string} [request.finalBackupDescription]
     *   Optional. The description of the final backup.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.delete.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Delete_async
     */
    delete(request?: protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest | undefined,
        {} | undefined
    ]>;
    delete(request: protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest | null | undefined, {} | null | undefined>): void;
    delete(request: protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDeleteRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Demotes the stand-alone instance to be a Cloud SQL read replica for an
     * external database server.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance name.
     * @param {string} request.project
     *   ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesDemoteMasterRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.demote_master.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_DemoteMaster_async
     */
    demoteMaster(request?: protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest | undefined,
        {} | undefined
    ]>;
    demoteMaster(request: protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest | null | undefined, {} | null | undefined>): void;
    demoteMaster(request: protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDemoteMasterRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Demotes an existing standalone instance to be a Cloud SQL read replica
     * for an external database server.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance name.
     * @param {string} request.project
     *   Required. ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesDemoteRequest} request.body
     *   Required. The request body.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.demote.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Demote_async
     */
    demote(request?: protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest | undefined,
        {} | undefined
    ]>;
    demote(request: protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest | null | undefined, {} | null | undefined>): void;
    demote(request: protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesDemoteRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Exports data from a Cloud SQL instance to a Cloud Storage bucket as a SQL
     * dump or CSV file.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance to be exported.
     * @param {google.cloud.sql.v1.InstancesExportRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.export.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Export_async
     */
    export(request?: protos.google.cloud.sql.v1.ISqlInstancesExportRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesExportRequest | undefined,
        {} | undefined
    ]>;
    export(request: protos.google.cloud.sql.v1.ISqlInstancesExportRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesExportRequest | null | undefined, {} | null | undefined>): void;
    export(request: protos.google.cloud.sql.v1.ISqlInstancesExportRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesExportRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Initiates a manual failover of a high availability (HA) primary instance
     * to a standby instance, which becomes the primary instance. Users are
     * then rerouted to the new primary. For more information, see the
     * [Overview of high
     * availability](https://cloud.google.com/sql/docs/mysql/high-availability)
     * page in the Cloud SQL documentation.
     * If using Legacy HA (MySQL only), this causes the instance to failover to
     * its failover replica instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   ID of the project that contains the read replica.
     * @param {google.cloud.sql.v1.InstancesFailoverRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.failover.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Failover_async
     */
    failover(request?: protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest | undefined,
        {} | undefined
    ]>;
    failover(request: protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest | null | undefined, {} | null | undefined>): void;
    failover(request: protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesFailoverRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Reencrypt CMEK instance with latest key version.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesReencryptRequest} request.body
     *   Reencrypt body that users request
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.reencrypt.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Reencrypt_async
     */
    reencrypt(request?: protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest | undefined,
        {} | undefined
    ]>;
    reencrypt(request: protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest | null | undefined, {} | null | undefined>): void;
    reencrypt(request: protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesReencryptRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Retrieves a resource containing information about a Cloud SQL instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Database instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.DatabaseInstance|DatabaseInstance}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.get.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Get_async
     */
    get(request?: protos.google.cloud.sql.v1.ISqlInstancesGetRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IDatabaseInstance,
        protos.google.cloud.sql.v1.ISqlInstancesGetRequest | undefined,
        {} | undefined
    ]>;
    get(request: protos.google.cloud.sql.v1.ISqlInstancesGetRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IDatabaseInstance, protos.google.cloud.sql.v1.ISqlInstancesGetRequest | null | undefined, {} | null | undefined>): void;
    get(request: protos.google.cloud.sql.v1.ISqlInstancesGetRequest, callback: Callback<protos.google.cloud.sql.v1.IDatabaseInstance, protos.google.cloud.sql.v1.ISqlInstancesGetRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Imports data into a Cloud SQL instance from a SQL dump  or CSV file in
     * Cloud Storage.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesImportRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.import.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Import_async
     */
    import(request?: protos.google.cloud.sql.v1.ISqlInstancesImportRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesImportRequest | undefined,
        {} | undefined
    ]>;
    import(request: protos.google.cloud.sql.v1.ISqlInstancesImportRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesImportRequest | null | undefined, {} | null | undefined>): void;
    import(request: protos.google.cloud.sql.v1.ISqlInstancesImportRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesImportRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Creates a new Cloud SQL instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.project
     *   Project ID of the project to which the newly created Cloud SQL instances
     *   should belong.
     * @param {google.cloud.sql.v1.DatabaseInstance} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.insert.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Insert_async
     */
    insert(request?: protos.google.cloud.sql.v1.ISqlInstancesInsertRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesInsertRequest | undefined,
        {} | undefined
    ]>;
    insert(request: protos.google.cloud.sql.v1.ISqlInstancesInsertRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesInsertRequest | null | undefined, {} | null | undefined>): void;
    insert(request: protos.google.cloud.sql.v1.ISqlInstancesInsertRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesInsertRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Lists instances under a given project.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.filter
     *   A filter expression that filters resources listed in the response.
     *   The expression is in the form of field:value. For example,
     *   'instanceType:CLOUD_SQL_INSTANCE'. Fields can be nested as needed as per
     *   their JSON representation, such as 'settings.userLabels.auto_start:true'.
     *
     *   Multiple filter queries are space-separated. For example.
     *   'state:RUNNABLE instanceType:CLOUD_SQL_INSTANCE'. By default, each
     *   expression is an AND expression. However, you can include AND and OR
     *   expressions explicitly.
     * @param {number} request.maxResults
     *   The maximum number of instances to return. The service may return fewer
     *   than this value.
     *   If unspecified, at most 500 instances are returned.
     *   The maximum value is 1000; values above 1000 are coerced to 1000.
     * @param {string} request.pageToken
     *   A previously-returned page token representing part of the larger set of
     *   results to view.
     * @param {string} request.project
     *   Project ID of the project for which to list Cloud SQL instances.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.InstancesListResponse|InstancesListResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.list.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_List_async
     */
    list(request?: protos.google.cloud.sql.v1.ISqlInstancesListRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IInstancesListResponse,
        protos.google.cloud.sql.v1.ISqlInstancesListRequest | undefined,
        {} | undefined
    ]>;
    list(request: protos.google.cloud.sql.v1.ISqlInstancesListRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IInstancesListResponse, protos.google.cloud.sql.v1.ISqlInstancesListRequest | null | undefined, {} | null | undefined>): void;
    list(request: protos.google.cloud.sql.v1.ISqlInstancesListRequest, callback: Callback<protos.google.cloud.sql.v1.IInstancesListResponse, protos.google.cloud.sql.v1.ISqlInstancesListRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Lists all of the trusted Certificate Authorities (CAs) for the specified
     * instance. There can be up to three CAs listed: the CA that was used to sign
     * the certificate that is currently in use, a CA that has been added but not
     * yet used to sign a certificate, and a CA used to sign a certificate that
     * has previously rotated out.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.InstancesListServerCasResponse|InstancesListServerCasResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.list_server_cas.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ListServerCas_async
     */
    listServerCas(request?: protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IInstancesListServerCasResponse,
        protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest | undefined,
        {} | undefined
    ]>;
    listServerCas(request: protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IInstancesListServerCasResponse, protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest | null | undefined, {} | null | undefined>): void;
    listServerCas(request: protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest, callback: Callback<protos.google.cloud.sql.v1.IInstancesListServerCasResponse, protos.google.cloud.sql.v1.ISqlInstancesListServerCasRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Lists all versions of server certificates and certificate authorities (CAs)
     * for the specified instance. There can be up to three sets of certs listed:
     * the certificate that is currently in use, a future that has been added but
     * not yet used to sign a certificate, and a certificate that has been rotated
     * out. For instances not using Certificate Authority Service (CAS) server CA,
     * use ListServerCas instead.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.InstancesListServerCertificatesResponse|InstancesListServerCertificatesResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.list_server_certificates.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ListServerCertificates_async
     */
    listServerCertificates(request?: protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IInstancesListServerCertificatesResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest | undefined),
        {} | undefined
    ]>;
    listServerCertificates(request: protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IInstancesListServerCertificatesResponse, protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest | null | undefined, {} | null | undefined>): void;
    listServerCertificates(request: protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest, callback: Callback<protos.google.cloud.sql.v1.IInstancesListServerCertificatesResponse, protos.google.cloud.sql.v1.ISqlInstancesListServerCertificatesRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Lists all versions of EntraID certificates for the specified instance.
     * There can be up to three sets of certificates listed: the certificate that
     * is currently in use, a future that has been added but not yet used to sign
     * a certificate, and a certificate that has been rotated out.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.InstancesListEntraIdCertificatesResponse|InstancesListEntraIdCertificatesResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.list_entra_id_certificates.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ListEntraIdCertificates_async
     */
    listEntraIdCertificates(request?: protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IInstancesListEntraIdCertificatesResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest | undefined),
        {} | undefined
    ]>;
    listEntraIdCertificates(request: protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IInstancesListEntraIdCertificatesResponse, protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest | null | undefined, {} | null | undefined>): void;
    listEntraIdCertificates(request: protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest, callback: Callback<protos.google.cloud.sql.v1.IInstancesListEntraIdCertificatesResponse, protos.google.cloud.sql.v1.ISqlInstancesListEntraIdCertificatesRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Partially updates settings of a Cloud SQL instance by merging the request
     * with the current configuration. This method supports patch semantics.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {boolean} [request.reconcilePscNetworking]
     *   Optional. Set PSC config to the same value as the existing config to
     *   reconcile the PSC networking.
     * @param {boolean} [request.reconcilePscNetworkingForce]
     *   Optional. Set PSC config to the same value as the existing config and force
     *   reconcile the PSC networking.
     * @param {google.cloud.sql.v1.DatabaseInstance} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.patch.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Patch_async
     */
    patch(request?: protos.google.cloud.sql.v1.ISqlInstancesPatchRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesPatchRequest | undefined,
        {} | undefined
    ]>;
    patch(request: protos.google.cloud.sql.v1.ISqlInstancesPatchRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPatchRequest | null | undefined, {} | null | undefined>): void;
    patch(request: protos.google.cloud.sql.v1.ISqlInstancesPatchRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPatchRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Promotes the read replica instance to be an independent Cloud SQL
     * primary instance.
     * Using this operation might cause your instance to restart.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL read replica instance name.
     * @param {string} request.project
     *   ID of the project that contains the read replica.
     * @param {boolean} request.failover
     *   Set to true to invoke a replica failover to the DR
     *   replica. As part of replica failover, the promote operation attempts
     *   to add the original primary instance as a replica of the promoted
     *   DR replica when the original primary instance comes back online.
     *   If set to false or not specified, then the original primary
     *   instance becomes an independent Cloud SQL primary instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.promote_replica.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_PromoteReplica_async
     */
    promoteReplica(request?: protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest | undefined,
        {} | undefined
    ]>;
    promoteReplica(request: protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest | null | undefined, {} | null | undefined>): void;
    promoteReplica(request: protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPromoteReplicaRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Switches over from the primary instance to the DR replica
     * instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL read replica instance name.
     * @param {string} request.project
     *   ID of the project that contains the replica.
     * @param {google.protobuf.Duration} [request.dbTimeout]
     *   Optional. (MySQL and PostgreSQL only) Cloud SQL instance operations
     *   timeout, which is a sum of all database operations. Default value is 10
     *   minutes and can be modified to a maximum value of 24 hours.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.switchover.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Switchover_async
     */
    switchover(request?: protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest | undefined,
        {} | undefined
    ]>;
    switchover(request: protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest | null | undefined, {} | null | undefined>): void;
    switchover(request: protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesSwitchoverRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Deletes all client certificates and generates a new server SSL certificate
     * for the instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.SqlInstancesResetSslConfigRequest.ResetSslMode} [request.mode]
     *   Optional. Reset SSL mode to use.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.reset_ssl_config.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ResetSslConfig_async
     */
    resetSslConfig(request?: protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest | undefined,
        {} | undefined
    ]>;
    resetSslConfig(request: protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest | null | undefined, {} | null | undefined>): void;
    resetSslConfig(request: protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesResetSslConfigRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Restarts a Cloud SQL instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance to be restarted.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.restart.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Restart_async
     */
    restart(request?: protos.google.cloud.sql.v1.ISqlInstancesRestartRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesRestartRequest | undefined,
        {} | undefined
    ]>;
    restart(request: protos.google.cloud.sql.v1.ISqlInstancesRestartRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRestartRequest | null | undefined, {} | null | undefined>): void;
    restart(request: protos.google.cloud.sql.v1.ISqlInstancesRestartRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRestartRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Restores a backup of a Cloud SQL instance. Using this operation might cause
     * your instance to restart.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesRestoreBackupRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.restore_backup.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_RestoreBackup_async
     */
    restoreBackup(request?: protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest | undefined,
        {} | undefined
    ]>;
    restoreBackup(request: protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest | null | undefined, {} | null | undefined>): void;
    restoreBackup(request: protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRestoreBackupRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Rotates the server certificate to one signed by the Certificate Authority
     * (CA) version previously added with the addServerCA method. For instances
     * that have enabled Certificate Authority Service (CAS) based server CA,
     * use RotateServerCertificate to rotate the server certificate.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesRotateServerCaRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.rotate_server_ca.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_RotateServerCa_async
     */
    rotateServerCa(request?: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest | undefined,
        {} | undefined
    ]>;
    rotateServerCa(request: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest | null | undefined, {} | null | undefined>): void;
    rotateServerCa(request: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateServerCaRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Rotates the server certificate version to one previously added with the
     * addServerCertificate method. For instances not using Certificate Authority
     * Service (CAS) server CA, use RotateServerCa instead.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesRotateServerCertificateRequest} [request.body]
     *   Optional. Rotate server certificate request body.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.rotate_server_certificate.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_RotateServerCertificate_async
     */
    rotateServerCertificate(request?: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest | undefined),
        {} | undefined
    ]>;
    rotateServerCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest | null | undefined, {} | null | undefined>): void;
    rotateServerCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateServerCertificateRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Rotates the server certificate version to one previously added with the
     * addEntraIdCertificate method.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesRotateEntraIdCertificateRequest} [request.body]
     *   Optional. Rotate Entra ID certificate request body.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.rotate_entra_id_certificate.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_RotateEntraIdCertificate_async
     */
    rotateEntraIdCertificate(request?: protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest | undefined),
        {} | undefined
    ]>;
    rotateEntraIdCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest | null | undefined, {} | null | undefined>): void;
    rotateEntraIdCertificate(request: protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRotateEntraIdCertificateRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Starts the replication in the read replica instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL read replica instance name.
     * @param {string} request.project
     *   ID of the project that contains the read replica.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.start_replica.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_StartReplica_async
     */
    startReplica(request?: protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest | undefined,
        {} | undefined
    ]>;
    startReplica(request: protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest | null | undefined, {} | null | undefined>): void;
    startReplica(request: protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStartReplicaRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Stops the replication in the read replica instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL read replica instance name.
     * @param {string} request.project
     *   ID of the project that contains the read replica.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.stop_replica.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_StopReplica_async
     */
    stopReplica(request?: protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest | undefined,
        {} | undefined
    ]>;
    stopReplica(request: protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest | null | undefined, {} | null | undefined>): void;
    stopReplica(request: protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStopReplicaRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Truncate MySQL general and slow query log tables
     * MySQL only.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the Cloud SQL project.
     * @param {google.cloud.sql.v1.InstancesTruncateLogRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.truncate_log.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_TruncateLog_async
     */
    truncateLog(request?: protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest | undefined,
        {} | undefined
    ]>;
    truncateLog(request: protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest | null | undefined, {} | null | undefined>): void;
    truncateLog(request: protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesTruncateLogRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Updates settings of a Cloud SQL instance. Using this operation might cause
     * your instance to restart.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.DatabaseInstance} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.update.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_Update_async
     */
    update(request?: protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest | undefined,
        {} | undefined
    ]>;
    update(request: protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest | null | undefined, {} | null | undefined>): void;
    update(request: protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesUpdateRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Generates a short-lived X509 certificate containing the provided public key
     * and signed by a private key specific to the target instance. Users may use
     * the certificate to authenticate as themselves when connecting to the
     * database.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the Cloud SQL project.
     * @param {google.cloud.sql.v1.SslCertsCreateEphemeralRequest} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SslCert|SslCert}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.create_ephemeral.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_CreateEphemeral_async
     */
    createEphemeral(request?: protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISslCert,
        (protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest | undefined),
        {} | undefined
    ]>;
    createEphemeral(request: protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISslCert, protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest | null | undefined, {} | null | undefined>): void;
    createEphemeral(request: protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest, callback: Callback<protos.google.cloud.sql.v1.ISslCert, protos.google.cloud.sql.v1.ISqlInstancesCreateEphemeralCertRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Reschedules the maintenance on the given instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.SqlInstancesRescheduleMaintenanceRequestBody} request.body
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.reschedule_maintenance.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_RescheduleMaintenance_async
     */
    rescheduleMaintenance(request?: protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest | undefined),
        {} | undefined
    ]>;
    rescheduleMaintenance(request: protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest | null | undefined, {} | null | undefined>): void;
    rescheduleMaintenance(request: protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesRescheduleMaintenanceRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Verify External primary instance external sync settings.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {boolean} request.verifyConnectionOnly
     *   Flag to enable verifying connection only
     * @param {google.cloud.sql.v1.SqlInstancesVerifyExternalSyncSettingsRequest.ExternalSyncMode} request.syncMode
     *   External sync mode
     * @param {boolean} [request.verifyReplicationOnly]
     *   Optional. Flag to verify settings required by replication setup only
     * @param {google.cloud.sql.v1.MySqlSyncConfig} [request.mysqlSyncConfig]
     *   Optional. MySQL-specific settings for start external sync.
     * @param {google.cloud.sql.v1.SqlInstancesVerifyExternalSyncSettingsRequest.MigrationType} [request.migrationType]
     *   Optional. MigrationType configures the migration to use physical files or
     *   logical dump files. If not set, then the logical dump file configuration is
     *   used. Valid values are `LOGICAL` or `PHYSICAL`. Only applicable to MySQL.
     * @param {google.cloud.sql.v1.ExternalSyncParallelLevel} [request.syncParallelLevel]
     *   Optional. Parallel level for initial data sync. Only applicable for
     *   PostgreSQL.
     * @param {number[]} [request.selectedObjects]
     *   Optional. Migrate only the specified objects from the source instance. If
     *   this field is empty, then migrate all objects.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesVerifyExternalSyncSettingsResponse|SqlInstancesVerifyExternalSyncSettingsResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.verify_external_sync_settings.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_VerifyExternalSyncSettings_async
     */
    verifyExternalSyncSettings(request?: protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest | undefined),
        {} | undefined
    ]>;
    verifyExternalSyncSettings(request: protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsResponse, protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest | null | undefined, {} | null | undefined>): void;
    verifyExternalSyncSettings(request: protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsResponse, protos.google.cloud.sql.v1.ISqlInstancesVerifyExternalSyncSettingsRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Start External primary instance migration.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.SqlInstancesVerifyExternalSyncSettingsRequest.ExternalSyncMode} request.syncMode
     *   External sync mode.
     * @param {boolean} request.skipVerification
     *   Whether to skip the verification step (VESS).
     * @param {google.cloud.sql.v1.MySqlSyncConfig} request.mysqlSyncConfig
     *   MySQL-specific settings for start external sync.
     * @param {google.cloud.sql.v1.ExternalSyncParallelLevel} [request.syncParallelLevel]
     *   Optional. Parallel level for initial data sync. Currently only applicable
     *   for MySQL.
     * @param {google.cloud.sql.v1.SqlInstancesVerifyExternalSyncSettingsRequest.MigrationType} [request.migrationType]
     *   Optional. MigrationType configures the migration to use physical files or
     *   logical dump files. If not set, then the logical dump file configuration is
     *   used. Valid values are `LOGICAL` or `PHYSICAL`. Only applicable to MySQL.
     * @param {boolean} [request.replicaOverwriteEnabled]
     *   Optional. MySQL only. True if end-user has confirmed that this SES call
     *   will wipe replica databases overlapping with the proposed selected_objects.
     *   If this field is not set and there are both overlapping and additional
     *   databases proposed, an error will be returned.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.start_external_sync.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_StartExternalSync_async
     */
    startExternalSync(request?: protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest | undefined),
        {} | undefined
    ]>;
    startExternalSync(request: protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest | null | undefined, {} | null | undefined>): void;
    startExternalSync(request: protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesStartExternalSyncRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Perform Disk Shrink on primary instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.PerformDiskShrinkContext} request.body
     *   Perform disk shrink context.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.perform_disk_shrink.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_PerformDiskShrink_async
     */
    performDiskShrink(request?: protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest | undefined),
        {} | undefined
    ]>;
    performDiskShrink(request: protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest | null | undefined, {} | null | undefined>): void;
    performDiskShrink(request: protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPerformDiskShrinkRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Get Disk Shrink Config for a given instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesGetDiskShrinkConfigResponse|SqlInstancesGetDiskShrinkConfigResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.get_disk_shrink_config.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_GetDiskShrinkConfig_async
     */
    getDiskShrinkConfig(request?: protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest | undefined),
        {} | undefined
    ]>;
    getDiskShrinkConfig(request: protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigResponse, protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest | null | undefined, {} | null | undefined>): void;
    getDiskShrinkConfig(request: protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigResponse, protos.google.cloud.sql.v1.ISqlInstancesGetDiskShrinkConfigRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Reset Replica Size to primary instance disk size.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL read replica instance name.
     * @param {string} request.project
     *   ID of the project that contains the read replica.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.reset_replica_size.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ResetReplicaSize_async
     */
    resetReplicaSize(request?: protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest | undefined),
        {} | undefined
    ]>;
    resetReplicaSize(request: protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest | null | undefined, {} | null | undefined>): void;
    resetReplicaSize(request: protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesResetReplicaSizeRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Get Latest Recovery Time for a given instance.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Project ID of the project that contains the instance.
     * @param {google.protobuf.Timestamp} request.sourceInstanceDeletionTime
     *   The timestamp used to identify the time when the source instance is
     *   deleted. If this instance is deleted, then you must set the timestamp.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesGetLatestRecoveryTimeResponse|SqlInstancesGetLatestRecoveryTimeResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.get_latest_recovery_time.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_GetLatestRecoveryTime_async
     */
    getLatestRecoveryTime(request?: protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest | undefined),
        {} | undefined
    ]>;
    getLatestRecoveryTime(request: protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeResponse, protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest | null | undefined, {} | null | undefined>): void;
    getLatestRecoveryTime(request: protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeResponse, protos.google.cloud.sql.v1.ISqlInstancesGetLatestRecoveryTimeRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Execute SQL statements.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Database instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.ExecuteSqlPayload} request.body
     *   The request body.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesExecuteSqlResponse|SqlInstancesExecuteSqlResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.execute_sql.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ExecuteSql_async
     */
    executeSql(request?: protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlResponse,
        protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest | undefined,
        {} | undefined
    ]>;
    executeSql(request: protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlResponse, protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest | null | undefined, {} | null | undefined>): void;
    executeSql(request: protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlResponse, protos.google.cloud.sql.v1.ISqlInstancesExecuteSqlRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Acquire a lease for the setup of SQL Server Reporting Services (SSRS).
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This doesn't include the project ID. It's
     *   composed of lowercase letters, numbers, and hyphens, and it must start with
     *   a letter. The total length must be 98 characters or less (Example:
     *   instance-id).
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance (Example:
     *   project-id).
     * @param {google.cloud.sql.v1.InstancesAcquireSsrsLeaseRequest} request.body
     *   Required. The request body.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesAcquireSsrsLeaseResponse|SqlInstancesAcquireSsrsLeaseResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.acquire_ssrs_lease.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_AcquireSsrsLease_async
     */
    acquireSsrsLease(request?: protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest | undefined),
        {} | undefined
    ]>;
    acquireSsrsLease(request: protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseResponse, protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest | null | undefined, {} | null | undefined>): void;
    acquireSsrsLease(request: protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseResponse, protos.google.cloud.sql.v1.ISqlInstancesAcquireSsrsLeaseRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Release a lease for the setup of SQL Server Reporting Services (SSRS).
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. The Cloud SQL instance ID. This doesn't include the project ID.
     *   The instance ID contains lowercase letters, numbers, and hyphens, and it
     *   must start with a letter. This ID can have a maximum length of 98
     *   characters.
     * @param {string} request.project
     *   Required. The project ID that contains the instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.SqlInstancesReleaseSsrsLeaseResponse|SqlInstancesReleaseSsrsLeaseResponse}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.release_ssrs_lease.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_ReleaseSsrsLease_async
     */
    releaseSsrsLease(request?: protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseResponse,
        (protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest | undefined),
        {} | undefined
    ]>;
    releaseSsrsLease(request: protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseResponse, protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest | null | undefined, {} | null | undefined>): void;
    releaseSsrsLease(request: protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest, callback: Callback<protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseResponse, protos.google.cloud.sql.v1.ISqlInstancesReleaseSsrsLeaseRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Execute MVU Pre-checks
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.instance
     *   Required. Cloud SQL instance ID. This does not include the project ID.
     * @param {string} request.project
     *   Required. Project ID of the project that contains the instance.
     * @param {google.cloud.sql.v1.InstancesPreCheckMajorVersionUpgradeRequest} request.body
     *   Required. The context for request to perform the pre-check major version
     *   upgrade operation.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.pre_check_major_version_upgrade.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_PreCheckMajorVersionUpgrade_async
     */
    preCheckMajorVersionUpgrade(request?: protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest | undefined),
        {} | undefined
    ]>;
    preCheckMajorVersionUpgrade(request: protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest | null | undefined, {} | null | undefined>): void;
    preCheckMajorVersionUpgrade(request: protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPreCheckMajorVersionUpgradeRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Point in time restore for an instance managed by Google Cloud Backup and
     * Disaster Recovery.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.parent
     *   Required. The parent resource where you created this instance.
     *   Format: projects/{project}
     * @param {google.cloud.sql.v1.PointInTimeRestoreContext} request.context
     *   Required. The context for request to perform a PITR on a Google Cloud
     *   Backup and Disaster Recovery managed instance.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1/sql_instances_service.point_in_time_restore.js</caption>
     * region_tag:sqladmin_v1_generated_SqlInstancesService_PointInTimeRestore_async
     */
    pointInTimeRestore(request?: protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1.IOperation,
        (protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest | undefined),
        {} | undefined
    ]>;
    pointInTimeRestore(request: protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest | null | undefined, {} | null | undefined>): void;
    pointInTimeRestore(request: protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest, callback: Callback<protos.google.cloud.sql.v1.IOperation, protos.google.cloud.sql.v1.ISqlInstancesPointInTimeRestoreRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Gets information about a location.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   Resource name for the location.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html | CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link google.cloud.location.Location | Location}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example
     * ```
     * const [response] = await client.getLocation(request);
     * ```
     */
    getLocation(request: LocationProtos.google.cloud.location.IGetLocationRequest, options?: gax.CallOptions | Callback<LocationProtos.google.cloud.location.ILocation, LocationProtos.google.cloud.location.IGetLocationRequest | null | undefined, {} | null | undefined>, callback?: Callback<LocationProtos.google.cloud.location.ILocation, LocationProtos.google.cloud.location.IGetLocationRequest | null | undefined, {} | null | undefined>): Promise<LocationProtos.google.cloud.location.ILocation>;
    /**
     * Lists information about the supported locations for this service. Returns an iterable object.
     *
     * `for`-`await`-`of` syntax is used with the iterable to get response elements on-demand.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   The resource that owns the locations collection, if applicable.
     * @param {string} request.filter
     *   The standard list filter.
     * @param {number} request.pageSize
     *   The standard list page size.
     * @param {string} request.pageToken
     *   The standard list page token.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Object}
     *   An iterable Object that allows {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols | async iteration }.
     *   When you iterate the returned iterable, each element will be an object representing
     *   {@link google.cloud.location.Location | Location}. The API will be called under the hood as needed, once per the page,
     *   so you can stop the iteration when you don't need more results.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination | documentation }
     *   for more details and examples.
     * @example
     * ```
     * const iterable = client.listLocationsAsync(request);
     * for await (const response of iterable) {
     *   // process response
     * }
     * ```
     */
    listLocationsAsync(request: LocationProtos.google.cloud.location.IListLocationsRequest, options?: CallOptions): AsyncIterable<LocationProtos.google.cloud.location.ILocation>;
    /**
     * Return a fully-qualified backup resource name string.
     *
     * @param {string} project
     * @param {string} location
     * @param {string} backupvault
     * @param {string} datasource
     * @param {string} backup
     * @returns {string} Resource name string.
     */
    backupPath(project: string, location: string, backupvault: string, datasource: string, backup: string): string;
    /**
     * Parse the project from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the project.
     */
    matchProjectFromBackupName(backupName: string): string | number;
    /**
     * Parse the location from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the location.
     */
    matchLocationFromBackupName(backupName: string): string | number;
    /**
     * Parse the backupvault from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the backupvault.
     */
    matchBackupvaultFromBackupName(backupName: string): string | number;
    /**
     * Parse the datasource from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the datasource.
     */
    matchDatasourceFromBackupName(backupName: string): string | number;
    /**
     * Parse the backup from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the backup.
     */
    matchBackupFromBackupName(backupName: string): string | number;
    /**
     * Return a fully-qualified network resource name string.
     *
     * @param {string} project
     * @param {string} network
     * @returns {string} Resource name string.
     */
    networkPath(project: string, network: string): string;
    /**
     * Parse the project from Network resource.
     *
     * @param {string} networkName
     *   A fully-qualified path representing Network resource.
     * @returns {string} A string representing the project.
     */
    matchProjectFromNetworkName(networkName: string): string | number;
    /**
     * Parse the network from Network resource.
     *
     * @param {string} networkName
     *   A fully-qualified path representing Network resource.
     * @returns {string} A string representing the network.
     */
    matchNetworkFromNetworkName(networkName: string): string | number;
    /**
     * Terminate the gRPC channel and close the client.
     *
     * The client will no longer be usable and all future behavior is undefined.
     * @returns {Promise} A promise that resolves when the client is closed.
     */
    close(): Promise<void>;
}
