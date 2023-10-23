
import excelJS from 'exceljs'
import fs from 'fs'

const run = async (data) => {
    try {

        let workbook = new excelJS.Workbook()
        const sheet = workbook.addWorksheet('sheet1');
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            sheet.columns = keys.map((key) => {
                return {
                    header: key,
                    key: key
                }
            })
            await data.map((val) => {
                let newObj = {}
                keys.map((key) => {
                    newObj[key] = val[key]
                })
                sheet.addRow(newObj)
            })
        }
        return workbook.xlsx
    } catch (error) {
        throw new Error('Failed. \n' + error)
    }
}

export default run