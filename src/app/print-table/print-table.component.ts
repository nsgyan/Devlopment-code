import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../service/account.service';
import { CompanyService } from '../service/company.service';
import { ContactService } from '../service/contact.service';
import { ProductService } from '../service/product.service';
import { QuoteFormService } from '../service/quote-form.service';
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.css'],
})
export class PrintTableComponent implements OnInit {
  download() {
    var element = document.getElementById('body');
    var opt = {
      margin: 0,
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }

  quote_id: any;
  quoteData: any;
  validDate: any;
  quoteDate: any;
  contactData: any;
  salesPersonData: any;
  companyData: any;
  branchData: any;
  totalAmount: any = 0;
  quantity: any = 0;
  totalAmountTax: any = 0;
  totalAmount1: any = 0;
  totalGST: any = 0;

  groupView: Boolean = false;
  grouw: Boolean = true;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private account: AccountService,
    private contact: ContactService,
    private company: CompanyService,
    private titleService: Title,
    private salesperson: ProductService,
    private quote: QuoteFormService
  ) {}

  public setTitle() {
    this.titleService.setTitle('omshakti');
  }

  showGroup(a:Boolean) {
    this.groupView = a;
    this.grouw=!a;
  }

  ngOnInit(): void {
    this.quote_id = this._Activatedroute.snapshot.paramMap.get('id');
    let qtdate = new Date();
    this.quoteDate = qtdate.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    this.quote
      .getQuoteById(this._Activatedroute.snapshot.paramMap.get('id'))
      .subscribe((data: any) => {
        console.log(data.result[0]);
        this.quoteData = data.result[0];
        let date = this.addDays(
          data.result[0].created_date_time,
          Number(data.result[0].deal_validity.split(' ')[0])
        );
        this.validDate = date?.toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        this.quoteData.product_services.map((item: any) => {
          this.totalAmount += Number(item.amount);

          this.totalAmountTax +=
            (item.UnitPrice * 100) /
            (100 + parseFloat(item.GST == '' ? 0 : item.GST));
          // this.totalAmountTax+=((item.UnitPrice*100)/(100+parseFloat(item.GST)));
          this.quantity += parseInt(item.quantity);
          // console.log((item.UnitPrice)*100/118);
          if (item.type == 'Group') {
            this.getTaxableAmt(item.products);
          } else {
            this.totalGST +=
              item.amount -
              (item.amount * 100) /
                (100 + parseFloat(item.GST == '' ? 0 : item.GST));
            //  console.log(this.totalGST);
          }
        });

        this.account
          .getAccountData(data.result[0].account_id)
          .subscribe((data: any) => {
            console.log(data);
            this.companyData = data[0];
          });

        this.contact
          .getContactData(data.result[0].contact_id)
          .subscribe((data: any) => {
            // console.log(data)
            this.contactData = data[0];
          });

        this.salesperson
          .getSalesPerson(data.result[0]?.sales_person[0]?._id)
          .subscribe((data: any) => {
            // console.log(data)
            this.salesPersonData = data.result[0];
          });

        this.company
          .getBranch(data.result[0].quote_location[0]._id)
          .subscribe((data: any) => {
            console.log(data, 'branchDatabranchDatabranchData');
            this.branchData = data?.result[0];
          });
      });
    // this.getTaxableAmount()
  }

  getTaxableAmt(arr: any) {
    arr.map((item: any) => {
      if (item.type != 'Group') {
        console.log(item.GST);
        this.totalGST +=
          item.amount -
          (item.amount * 100) /
            (100 + parseFloat(item.GST == '' ? 0 : item.GST));
      } else {
        this.getTaxableAmt(item.products);
      }
    });
    console.log(this.totalGST, '================>>>>>>>>>>>>>');
  }

  decimalFormat(num: any) {
    // return num
    num = parseFloat(num);
    return num.toFixed(2);
  }
  addDays(date: any, days: any) {
    if (days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    return null;
  }

  setGst(amount: any, gst: any) {
    let cal = 0;
    if (gst == '') {
      cal = 0;
    } else {
      let GstValue = gst.split('%');
      cal = parseFloat(GstValue[0]) / 100;
    }

    return cal * parseFloat(amount);
  }
  taxableAmount: any;
  data: any;

  AddRow(arr: any) {}

  getTaxableAmount() {
    let data = this.quoteData.product_services;
    this.taxableAmount = 0;
    data.map((item: any) => {
      // console.log(item.GST)
      let cal = 0;

      if (item.GST == '') {
        cal = 0;
      } else {
        let GstValue = item.GST.split('%');
        cal = parseFloat(GstValue[0]) / 100;
      }

      if (item.GST == '') {
        cal = 0;
      } else {
        let GstValue = item.GST.split('%');
        cal = parseFloat(GstValue[0]) / 100;
      }
      this.taxableAmount += cal * parseFloat(item.amount);
    });
    return this.taxableAmount;
  }
}
