/* tslint:disable */
/* eslint-disable */
/**
 * Firma con IO - Issuer API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { DocumentDetailView } from './DocumentDetailView';
import {
    DocumentDetailViewFromJSON,
    DocumentDetailViewFromJSONTyped,
    DocumentDetailViewToJSON,
} from './DocumentDetailView';
import type { NotificationDetailView } from './NotificationDetailView';
import {
    NotificationDetailViewFromJSON,
    NotificationDetailViewFromJSONTyped,
    NotificationDetailViewToJSON,
} from './NotificationDetailView';

/**
 * 
 * @export
 * @interface SignatureRequestDetailView
 */
export interface SignatureRequestDetailView {
    /**
     * Entity Id
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    status: string;
    /**
     * Entity Id
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    dossierId: string;
    /**
     * Entity Id
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    signerId: string;
    /**
     * A date-time field in ISO-8601 format and UTC timezone.
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    expiresAt: string;
    /**
     * 
     * @type {Array<DocumentDetailView>}
     * @memberof SignatureRequestDetailView
     */
    documents: Array<DocumentDetailView>;
    /**
     * 
     * @type {NotificationDetailView}
     * @memberof SignatureRequestDetailView
     */
    notification?: NotificationDetailView;
    /**
     * A date-time field in ISO-8601 format and UTC timezone.
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    createdAt: string;
    /**
     * A date-time field in ISO-8601 format and UTC timezone.
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    updatedAt: string;
    /**
     * A date-time field in ISO-8601 format and UTC timezone.
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    signedAt?: string;
    /**
     * A date-time field in ISO-8601 format and UTC timezone.
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    rejectedAt?: string;
    /**
     * 
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    rejectReason?: string;
    /**
     * 
     * @type {string}
     * @memberof SignatureRequestDetailView
     */
    qrCodeUrl?: string;
}

/**
 * Check if a given object implements the SignatureRequestDetailView interface.
 */
export function instanceOfSignatureRequestDetailView(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "dossierId" in value;
    isInstance = isInstance && "signerId" in value;
    isInstance = isInstance && "expiresAt" in value;
    isInstance = isInstance && "documents" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function SignatureRequestDetailViewFromJSON(json: any): SignatureRequestDetailView {
    return SignatureRequestDetailViewFromJSONTyped(json, false);
}

export function SignatureRequestDetailViewFromJSONTyped(json: any, ignoreDiscriminator: boolean): SignatureRequestDetailView {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'status': json['status'],
        'dossierId': json['dossier_id'],
        'signerId': json['signer_id'],
        'expiresAt': json['expires_at'],
        'documents': ((json['documents'] as Array<any>).map(DocumentDetailViewFromJSON)),
        'notification': !exists(json, 'notification') ? undefined : NotificationDetailViewFromJSON(json['notification']),
        'createdAt': json['created_at'],
        'updatedAt': json['updated_at'],
        'signedAt': !exists(json, 'signed_at') ? undefined : json['signed_at'],
        'rejectedAt': !exists(json, 'rejected_at') ? undefined : json['rejected_at'],
        'rejectReason': !exists(json, 'reject_reason') ? undefined : json['reject_reason'],
        'qrCodeUrl': !exists(json, 'qr_code_url') ? undefined : json['qr_code_url'],
    };
}

export function SignatureRequestDetailViewToJSON(value?: SignatureRequestDetailView | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'status': value.status,
        'dossier_id': value.dossierId,
        'signer_id': value.signerId,
        'expires_at': value.expiresAt,
        'documents': ((value.documents as Array<any>).map(DocumentDetailViewToJSON)),
        'notification': NotificationDetailViewToJSON(value.notification),
        'created_at': value.createdAt,
        'updated_at': value.updatedAt,
        'signed_at': value.signedAt,
        'rejected_at': value.rejectedAt,
        'reject_reason': value.rejectReason,
        'qr_code_url': value.qrCodeUrl,
    };
}
