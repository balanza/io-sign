/**
 * Firma con IO - Issuer API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

export class DocumentToBeUploadedAllOf {
    'status': DocumentToBeUploadedAllOfStatusEnum;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "status",
            "baseName": "status",
            "type": "DocumentToBeUploadedAllOfStatusEnum",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return DocumentToBeUploadedAllOf.attributeTypeMap;
    }

    public constructor() {
    }
}


export type DocumentToBeUploadedAllOfStatusEnum = "WAIT_FOR_UPLOAD" ;
