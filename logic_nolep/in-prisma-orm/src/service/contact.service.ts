import { Contact, User } from "../../generated/prisma/client";
import { prisma } from "../application/prisma";
import { ResponseError } from "../error/response.error";
import { ContactResponse, CreateContactRequest, SearchContactRequest, toContactResponse, UpdateContactRequest } from "../model/contact.model";
import { Pageable } from "../model/page";
import { ContactValidation } from "../validation/contact.validation";
import { Validation } from "../validation/validation";

export class ContactService {

    public static async create(user: User, request: CreateContactRequest) : Promise<ContactResponse> {
        const createRequest = Validation.validate(ContactValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{ username: user.username }
        };

        const contact = await prisma.contact.create({
            data: record
        });

        return toContactResponse(contact);
    }

    public static async checkContactMustExists(username: string, contactId: number) : Promise<Contact> {
        const contact = await prisma.contact.findFirst({
            where: {
                id: contactId,
                username: username
            }
        });

        if (!contact) {
            throw new ResponseError(404, "Validation Error", {
                id: "Contact not found"
            });
        }

        return contact;
    }

    public static async get(user: User, id: number) : Promise<ContactResponse> {
        const contact = await this.checkContactMustExists(user.username, id);
        return toContactResponse(contact);
    }

    public static async update(user: User, request: UpdateContactRequest) : Promise<ContactResponse> {
        const updateRequest = Validation.validate(ContactValidation.UPDATE, request);
        await this.checkContactMustExists(user.username, Number(updateRequest.id));

        const contact = await prisma.contact.update({
            where: {
                id: Number(updateRequest.id),
                username: user.username,
            },
            data: updateRequest as any
        });

        return toContactResponse(contact);
    }   

    public static async remove(user: User, id: number) : Promise<ContactResponse> {
        await this.checkContactMustExists(user.username, id);

        const contact = await prisma.contact.delete({
            where: {
                id: id,
                username: user.username
            }
        });

        return toContactResponse(contact);
    }

    public static async search(user: User, request: SearchContactRequest) : Promise<Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request);
        const skip = (searchRequest.page - 1) * searchRequest.size;

        const filters = [];
        // check if name exists
        if (searchRequest.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name
                        }
                    },
                    {
                        last_name: {
                            contains: searchRequest.name
                        }
                    }
                ]
            });
        }
        // check if email exists
        if (searchRequest.email) {
            filters.push({
                email: {
                    contains: searchRequest.email
                }
            });
        }
        // check if phone exists
        if (searchRequest.phone) {
            filters.push({
                phone: {
                    contains: searchRequest.phone
                }
            });
        }

        const contacts = await prisma.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: searchRequest.size,
            skip: skip
        });

        const total = await prisma.contact.count({
            where: {
                username: user.username,
                AND: filters
            }
        });

        return {
            data: contacts.map(contact => toContactResponse(contact)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size
            }
        }
    }

}