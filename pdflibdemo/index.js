const { PDFDocument , StandardFonts , rgb } = require('pdf-lib')

const fs = require('fs');

async function createPdf() {
    
    //init doc 
    const doc = await PDFDocument.create()

    const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman)

    //add a page 
    const page = doc.addPage()

    const {width,height} = page.getSize()

    let fontsize = 25

    // add text to pdf 
    page.drawText("e-TravelKit" , {
        x: 50 , 
        y: height - 4 * fontsize , 
        size: fontsize ,
        font: timesRomanFont , 
        color:rgb(1.0,0.8,0)
    })

    // page.drawText("Demo ticket")
    // page.drawText(" Name CUSTOMER " , { 
    //     x: 50 ,
    //     y: height - 4 * fontsize , 
    //     size: fontsize , 
    //     font: timesRomanFont , 
    //     color:rgb(1.0,0,0)
    // })

    let startY = height - 150;
    const lineSpacing = 25;

    const textLines = [
        `Journey Date:`,
        // `${departureDate}`,
        `12/02/2024`,
        `Journey Time:`,
        // `${departureTime}`,
        `12:00 PM`,
        `Starting Location:`,
        // `${source}`,
        `Dhaka`,
        `Destination Location:`,
        // `${destination}`,
        `Chittagong`,
    ];

    let initalStart = startY;
    let ticketId = 1234567;

    page.drawText('Ticket ID: ' + ticketId, {
        x: 50,
        y: startY,
        size: 15,
        font: await doc.embedFont(StandardFonts.TimesRomanBold),
        color: rgb(0.2, 0.2, 0.2),
    });

    startY -= lineSpacing;

    let k = 0;
    for (const line of textLines) {
        page.drawText(line, {
            x: 50,
            y: startY,
            size: 10,
            font: await doc.embedFont(k % 2 === 0 ? StandardFonts.HelveticaBold : StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });
        k++;
        startY -= 15;
    }

    startY = initalStart - lineSpacing;

    const textLines2 = [
        `Company Name:`,
        // `${busServiceName}`,
        `Green Line` , 
        `Coach:`,
        // `${coachName}`,
        `AC` ,
        `Brand Name:`,
        // `${brandName}`,
        `Scania` , 
        `Bus ID`,
        // `${uniqueBusId}`,
        `987` ,
    ];

    k = 0;
    for (const line2 of textLines2) {
        page.drawText(line2, {
            x: width - 150,
            y: startY,
            size: 10,
            font: await doc.embedFont(k % 2 === 0 ? StandardFonts.HelveticaBold : StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });
        k += 1
        startY -= 15;
    }

    // Define colors
    const tableHeaderBackgroundColor = rgb(217 / 255, 196 / 255, 177 / 255);
    const tableBorderColor = rgb(0.7, 0.7, 0.7);

    // Define the table layout
    const tableX = 50;
    const tableY = 400;
    const rowHeight = 30;
    const colWidths = [120, 50, 50, 100, 80, 80];

    // Define the table header
    const tableHeader = ['Name', 'Age', 'Gender', 'Phone', 'Seat', 'Fare'];

    // Draw the table header with background color and border
    let currentY = tableY;
    for (let j = 0; j < tableHeader.length; j++) {
        // Draw background color rectangle for the table header cell
        page.drawRectangle({
            x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0),
            y: currentY,
            width: colWidths[j],
            height: rowHeight,
            color: tableHeaderBackgroundColor,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 2,
        });

        // Draw text for the table header cell
        page.drawText(tableHeader[j], {
            x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0) + 5, // Adjust the padding
            y: currentY + rowHeight / 2 - 6, // Center vertically
            size: 12,
            font: await doc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });
    }
    currentY -= rowHeight;

    let passengerData = []


    const name = "Shafi", age = '23', gender = 'M', phone = '123-456', seat = 'A2', fare = '500';

    const passengerRow = [name, age, gender, phone, seat, fare];
    passengerData.push(passengerRow);



    for (const rowData of passengerData) {
        for (let j = 0; j < rowData.length; j++) {
            // Draw border rectangle for the table cell
            page.drawRectangle({
                x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0),
                y: currentY,
                width: colWidths[j],
                height: rowHeight,
                borderColor: tableBorderColor,
                borderWidth: 1,
            });

            // Draw text for the table cell
            page.drawText(`${rowData[j]}`, {
                x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0) + 5, // Adjust the padding
                y: currentY + rowHeight / 2 - 6, // Center vertically
                size: 10,
                font: await doc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0, 0),
            });
        }
        currentY -= rowHeight;
    }

    let totalFare = 500 
    // Add the total price
    ; // Implement this function
    page.drawText(`Total Fare: Tk ${totalFare}`, {
        x: 400,
        y: currentY - 10,
        size: 15,
        font: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
        color: rgb(0.1, 0.1, 0.1),
    });


    // save the pdf 
    fs.writeFileSync("./ticket1.pdf" , await doc.save())


}

createPdf()