import { User } from "../../generated/prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, toAddressResponse, UpdateAddressRequest } from "../model/address.model";
import { AddressValidation } from "../validation/address.validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact.service";
import { prisma } from "../application/prisma";
import { ResponseError } from "../error/response.error";

export class AddressService {

    public static async create(user: User, request: CreateAddressRequest) : Promise<AddressResponse> {
        const createRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prisma.address.create({
            data: createRequest
        });

        return toAddressResponse(address);
    }

    public static async checkAddressMustExists(contactId: number, addressId: number) : Promise<AddressResponse> {
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId
            }
        });

        if (!address) {
            throw new ResponseError(404, 'Validation Error', {
                address: "Address is not found"
            });
        }

        return address;
    }

    public static async get(user: User, request: GetAddressRequest) : Promise<AddressResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        const address = await this.checkAddressMustExists(getRequest.contact_id, getRequest.id) as any;

        return toAddressResponse(address);
    }

    public static async update(user: User, request: UpdateAddressRequest) : Promise<AddressResponse> {
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        await this.checkAddressMustExists(updateRequest.contact_id, updateRequest.id)

        const address = await prisma.address.update({
            where: {
                id: updateRequest.id,
                contact_id: updateRequest.contact_id
            },
            data: updateRequest
        });

        return toAddressResponse(address);
    }

    public static async remove(user: User, request: RemoveAddressRequest) : Promise<AddressResponse> {
        const removeRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        await this.checkAddressMustExists(removeRequest.contact_id, removeRequest.id) as any;

        const address = await prisma.address.delete({
            where: {
                id: removeRequest.id
            }
        });

        return toAddressResponse(address);
    }

    public static async list(user: User, contactId: number) : Promise<Array<AddressResponse>> {
        await ContactService.checkContactMustExists(user.username, contactId);

        const addresses = await prisma.address.findMany({
            where: {
                contact_id: contactId
            }
        });

        return addresses.map((address) => toAddressResponse(address));
    }

}