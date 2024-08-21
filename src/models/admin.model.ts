import { RowDataPacket } from "mysql2"


export default interface Admin extends RowDataPacket {
id?: number,
name: string,
email: string,
avatar?: string,
password: string
}