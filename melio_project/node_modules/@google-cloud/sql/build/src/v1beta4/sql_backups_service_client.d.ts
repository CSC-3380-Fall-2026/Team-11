import type * as gax from 'google-gax';
import type { Callback, CallOptions, Descriptors, ClientOptions, PaginationCallback, LocationsClient, LocationProtos } from 'google-gax';
import { Transform } from 'stream';
import * as protos from '../../protos/protos';
/**
 * @class
 * @memberof v1beta4
 */
export declare class SqlBackupsServiceClient {
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
    sqlBackupsServiceStub?: Promise<{
        [name: string]: Function;
    }>;
    /**
     * Construct an instance of SqlBackupsServiceClient.
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
     *     const client = new SqlBackupsServiceClient({fallback: true}, gax);
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
     * Creates a backup for a Cloud SQL instance. This API can be used only to
     * create on-demand backups.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.parent
     *   Required. The parent resource where this backup is created.
     *   Format: projects/{project}
     * @param {google.cloud.sql.v1beta4.Backup} request.backup
     *   Required. The Backup to create.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1beta4.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta4/sql_backups_service.create_backup.js</caption>
     * region_tag:sqladmin_v1beta4_generated_SqlBackupsService_CreateBackup_async
     */
    createBackup(request?: protos.google.cloud.sql.v1beta4.ICreateBackupRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1beta4.IOperation,
        protos.google.cloud.sql.v1beta4.ICreateBackupRequest | undefined,
        {} | undefined
    ]>;
    createBackup(request: protos.google.cloud.sql.v1beta4.ICreateBackupRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.ICreateBackupRequest | null | undefined, {} | null | undefined>): void;
    createBackup(request: protos.google.cloud.sql.v1beta4.ICreateBackupRequest, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.ICreateBackupRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Retrieves a resource containing information about a backup.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   Required. The name of the backup to retrieve.
     *   Format: projects/{project}/backups/{backup}
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1beta4.Backup|Backup}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta4/sql_backups_service.get_backup.js</caption>
     * region_tag:sqladmin_v1beta4_generated_SqlBackupsService_GetBackup_async
     */
    getBackup(request?: protos.google.cloud.sql.v1beta4.IGetBackupRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1beta4.IBackup,
        protos.google.cloud.sql.v1beta4.IGetBackupRequest | undefined,
        {} | undefined
    ]>;
    getBackup(request: protos.google.cloud.sql.v1beta4.IGetBackupRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1beta4.IBackup, protos.google.cloud.sql.v1beta4.IGetBackupRequest | null | undefined, {} | null | undefined>): void;
    getBackup(request: protos.google.cloud.sql.v1beta4.IGetBackupRequest, callback: Callback<protos.google.cloud.sql.v1beta4.IBackup, protos.google.cloud.sql.v1beta4.IGetBackupRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Updates the retention period and the description of the backup. You can use
     * this API to update final backups only.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {google.cloud.sql.v1beta4.Backup} request.backup
     *   Required. The backup to update.
     *   The backup’s `name` field is used to identify the backup to update.
     *   Format: projects/{project}/backups/{backup}
     * @param {google.protobuf.FieldMask} request.updateMask
     *   The list of fields that you can update. You can update only the description
     *   and retention period of the final backup.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1beta4.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta4/sql_backups_service.update_backup.js</caption>
     * region_tag:sqladmin_v1beta4_generated_SqlBackupsService_UpdateBackup_async
     */
    updateBackup(request?: protos.google.cloud.sql.v1beta4.IUpdateBackupRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1beta4.IOperation,
        protos.google.cloud.sql.v1beta4.IUpdateBackupRequest | undefined,
        {} | undefined
    ]>;
    updateBackup(request: protos.google.cloud.sql.v1beta4.IUpdateBackupRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.IUpdateBackupRequest | null | undefined, {} | null | undefined>): void;
    updateBackup(request: protos.google.cloud.sql.v1beta4.IUpdateBackupRequest, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.IUpdateBackupRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Deletes the backup.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   Required. The name of the backup to delete.
     *   Format: projects/{project}/backups/{backup}
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing {@link protos.google.cloud.sql.v1beta4.Operation|Operation}.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta4/sql_backups_service.delete_backup.js</caption>
     * region_tag:sqladmin_v1beta4_generated_SqlBackupsService_DeleteBackup_async
     */
    deleteBackup(request?: protos.google.cloud.sql.v1beta4.IDeleteBackupRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1beta4.IOperation,
        protos.google.cloud.sql.v1beta4.IDeleteBackupRequest | undefined,
        {} | undefined
    ]>;
    deleteBackup(request: protos.google.cloud.sql.v1beta4.IDeleteBackupRequest, options: CallOptions, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.IDeleteBackupRequest | null | undefined, {} | null | undefined>): void;
    deleteBackup(request: protos.google.cloud.sql.v1beta4.IDeleteBackupRequest, callback: Callback<protos.google.cloud.sql.v1beta4.IOperation, protos.google.cloud.sql.v1beta4.IDeleteBackupRequest | null | undefined, {} | null | undefined>): void;
    /**
     * Lists all backups associated with the project.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.parent
     *   Required. The parent that owns this collection of backups.
     *   Format: projects/{project}
     * @param {number} request.pageSize
     *   The maximum number of backups to return per response. The service might
     *   return fewer backups than this value. If a value for this parameter isn't
     *   specified, then, at most, 500 backups are returned. The maximum value is
     *   2,000. Any values that you set, which are greater than 2,000, are changed
     *   to 2,000.
     * @param {string} request.pageToken
     *   A page token, received from a previous `ListBackups` call.
     *   Provide this to retrieve the subsequent page.
     *
     *   When paginating, all other parameters provided to `ListBackups` must match
     *   the call that provided the page token.
     * @param {string} request.filter
     *   Multiple filter queries are separated by spaces. For example,
     *   'instance:abc AND type:FINAL, 'location:us',
     *   'backupInterval.startTime>=1950-01-01T01:01:25.771Z'. You can filter by
     *   type, instance, backupInterval.startTime (creation time), or location.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is Array of {@link protos.google.cloud.sql.v1beta4.Backup|Backup}.
     *   The client library will perform auto-pagination by default: it will call the API as many
     *   times as needed and will merge results from all the pages into this array.
     *   Note that it can affect your quota.
     *   We recommend using `listBackupsAsync()`
     *   method described below for async iteration which you can stop as needed.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination | documentation }
     *   for more details and examples.
     */
    listBackups(request?: protos.google.cloud.sql.v1beta4.IListBackupsRequest, options?: CallOptions): Promise<[
        protos.google.cloud.sql.v1beta4.IBackup[],
        protos.google.cloud.sql.v1beta4.IListBackupsRequest | null,
        protos.google.cloud.sql.v1beta4.IListBackupsResponse
    ]>;
    listBackups(request: protos.google.cloud.sql.v1beta4.IListBackupsRequest, options: CallOptions, callback: PaginationCallback<protos.google.cloud.sql.v1beta4.IListBackupsRequest, protos.google.cloud.sql.v1beta4.IListBackupsResponse | null | undefined, protos.google.cloud.sql.v1beta4.IBackup>): void;
    listBackups(request: protos.google.cloud.sql.v1beta4.IListBackupsRequest, callback: PaginationCallback<protos.google.cloud.sql.v1beta4.IListBackupsRequest, protos.google.cloud.sql.v1beta4.IListBackupsResponse | null | undefined, protos.google.cloud.sql.v1beta4.IBackup>): void;
    /**
     * Equivalent to `listBackups`, but returns a NodeJS Stream object.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.parent
     *   Required. The parent that owns this collection of backups.
     *   Format: projects/{project}
     * @param {number} request.pageSize
     *   The maximum number of backups to return per response. The service might
     *   return fewer backups than this value. If a value for this parameter isn't
     *   specified, then, at most, 500 backups are returned. The maximum value is
     *   2,000. Any values that you set, which are greater than 2,000, are changed
     *   to 2,000.
     * @param {string} request.pageToken
     *   A page token, received from a previous `ListBackups` call.
     *   Provide this to retrieve the subsequent page.
     *
     *   When paginating, all other parameters provided to `ListBackups` must match
     *   the call that provided the page token.
     * @param {string} request.filter
     *   Multiple filter queries are separated by spaces. For example,
     *   'instance:abc AND type:FINAL, 'location:us',
     *   'backupInterval.startTime>=1950-01-01T01:01:25.771Z'. You can filter by
     *   type, instance, backupInterval.startTime (creation time), or location.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Stream}
     *   An object stream which emits an object representing {@link protos.google.cloud.sql.v1beta4.Backup|Backup} on 'data' event.
     *   The client library will perform auto-pagination by default: it will call the API as many
     *   times as needed. Note that it can affect your quota.
     *   We recommend using `listBackupsAsync()`
     *   method described below for async iteration which you can stop as needed.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination | documentation }
     *   for more details and examples.
     */
    listBackupsStream(request?: protos.google.cloud.sql.v1beta4.IListBackupsRequest, options?: CallOptions): Transform;
    /**
     * Equivalent to `listBackups`, but returns an iterable object.
     *
     * `for`-`await`-`of` syntax is used with the iterable to get response elements on-demand.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.parent
     *   Required. The parent that owns this collection of backups.
     *   Format: projects/{project}
     * @param {number} request.pageSize
     *   The maximum number of backups to return per response. The service might
     *   return fewer backups than this value. If a value for this parameter isn't
     *   specified, then, at most, 500 backups are returned. The maximum value is
     *   2,000. Any values that you set, which are greater than 2,000, are changed
     *   to 2,000.
     * @param {string} request.pageToken
     *   A page token, received from a previous `ListBackups` call.
     *   Provide this to retrieve the subsequent page.
     *
     *   When paginating, all other parameters provided to `ListBackups` must match
     *   the call that provided the page token.
     * @param {string} request.filter
     *   Multiple filter queries are separated by spaces. For example,
     *   'instance:abc AND type:FINAL, 'location:us',
     *   'backupInterval.startTime>=1950-01-01T01:01:25.771Z'. You can filter by
     *   type, instance, backupInterval.startTime (creation time), or location.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Object}
     *   An iterable Object that allows {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols | async iteration }.
     *   When you iterate the returned iterable, each element will be an object representing
     *   {@link protos.google.cloud.sql.v1beta4.Backup|Backup}. The API will be called under the hood as needed, once per the page,
     *   so you can stop the iteration when you don't need more results.
     *   Please see the {@link https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination | documentation }
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta4/sql_backups_service.list_backups.js</caption>
     * region_tag:sqladmin_v1beta4_generated_SqlBackupsService_ListBackups_async
     */
    listBackupsAsync(request?: protos.google.cloud.sql.v1beta4.IListBackupsRequest, options?: CallOptions): AsyncIterable<protos.google.cloud.sql.v1beta4.IBackup>;
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
     * @param {string} backup
     * @returns {string} Resource name string.
     */
    backupPath(project: string, backup: string): string;
    /**
     * Parse the project from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the project.
     */
    matchProjectFromBackupName(backupName: string): string | number;
    /**
     * Parse the backup from Backup resource.
     *
     * @param {string} backupName
     *   A fully-qualified path representing Backup resource.
     * @returns {string} A string representing the backup.
     */
    matchBackupFromBackupName(backupName: string): string | number;
    /**
     * Return a fully-qualified project resource name string.
     *
     * @param {string} project
     * @returns {string} Resource name string.
     */
    projectPath(project: string): string;
    /**
     * Parse the project from Project resource.
     *
     * @param {string} projectName
     *   A fully-qualified path representing Project resource.
     * @returns {string} A string representing the project.
     */
    matchProjectFromProjectName(projectName: string): string | number;
    /**
     * Terminate the gRPC channel and close the client.
     *
     * The client will no longer be usable and all future behavior is undefined.
     * @returns {Promise} A promise that resolves when the client is closed.
     */
    close(): Promise<void>;
}
