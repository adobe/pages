/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// import { createTag, addDefaultClass } from '../scripts.js';
/* global createTag, addDefaultClass */

function wrapUp(h1, heroCopy, ctaText, ctaLink, mainImageSrc) {
  const email = `<!DOCTYPE html>
  <%@ include view='adbePreProcess' %>
  <% var optOutLinkLabel = 'unsubscribe'; %>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
  <link rel="icon" href="https://www.adobe.com/favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="https://www.adobe.com/favicon.ico" type="image/x-icon">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="date=no">
  <meta name="format-detection" content="address=no">
  <meta name="format-detection" content="email=no">
  <title>Adobe</title>
  
  <!--[if mso]>
  <style type="text/css">
  body, table, td, .mobile-text {
  font-family:Helvetica Neue, Helvetica, Verdana, Arial, sans-serif !important;
  }
  </style>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  
  <style type="text/css">
  @import url("https://use.typekit.net/onr8tbr.css");
  .ReadMsgBody { width:100%;}
  .ExternalClass {width:100%;}
  table {border-collapse:collapse; margin:0 auto;}
  a, a:visited {color:#1473E6; text-decoration:none;}
  .legal a {text-decoration:underline;}
  /* iOS BLUE LINKS */
  a[x-apple-data-detectors] {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;}
  
  .mobile {border-spacing:0;display:none!important;height:0;max-height:0;mso-hide:all;overflow:hidden;visibility:hidden;width:0;}
    
    @media only screen and (max-width:480px) {
      u ~ div {
        min-width:100vw;
      }
      div > u ~ div {
            min-width: 100%;
      }
      .web {
         display:none !important;
         }
       
       .mobile {
         display:block !important;
         width:auto !important;
         overflow:visible !important;
         height:auto !important;
         max-height:inherit !important;
         font-size:15px !important;
         line-height:21px !important;
         visibility:visible !important;
         }
       
       .email-width {
         width:84% !important;
         }
       
       .full-width {
         width:100% !important;
         }
       
       .mobile-image {
         height:auto !important;
         width:100% !important;
         }
      
      .social {
        float:left !important;
        padding-top:100px !important;
        text-align:left !important;
      }
      
      .header {
        font-size:45px !important;
        line-height:50px !important;
      }
    }
  </style>
  </head>
  
  <body bgcolor="#E4E4E4" style="background-color:#E4E4E4; margin:0; padding:0;-webkit-font-smoothing:antialiased;width:100% !important;-webkit-text-size-adjust:none;" topmargin="0"><div style="font-size:1px; color:#E4E4E4; display:none; overflow:hidden; visibility:hidden;">Video 2: See how to create complex color effects with Illustrator. &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
  
  <table width="100%" bgcolor="#E4E4E4" style="background-color:#E4E4E4;" border="0" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td>
        <table class="full-width" align="center" width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;">
      <tr>
             <td bgcolor="#ffffff" style="background-color:#ffffff;">
             
              <!-- pod1 -->
              <table class="email-width" align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:500px;">
         <tr>
                <td style="color:#2C2C2C; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:18px; line-height:26px; padding-top:50px;">
            <table align="left" width="auto" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
              <td valign="middle" style="color:#000000; font-family:adobe-clean, Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;"><img alt="" src="http://landing.adobe.com/dam/global/images/illustrator-cc.mnemonic.240x234.png" width="auto" height="30" border="0" hspace="0" vspace="0" style="display:block; vertical-align:top;"/></td>
              <td width="10" style="width:10px;">&nbsp;</td>
              <td valign="top" style="color:#000000; font-family:adobe-clean, Arial, Helvetica, sans-serif; font-size:14px; line-height:20px;"><img alt="Adobe Illustrator" src="http://s7d9.scene7.com/is/image/AdobeDemandCreative/?fmt=png-alpha&size=320,60&wid=320&textAttr=144,strong&resolution=200&textPs=%7B%5C*%5Ciscolortbl%3B000000%3B%5Cfonttbl%7B%5Cf0%20Adobe%20Clean%20ExtraBold%3B%7D%7D%5Cf0%5Cfs40%5Csl-400%5Cvertalc%5Ckerningoptical%5Ccf1Adobe%20Illustrator" width="160" height="30" border="0" hspace="0" vspace="0" style="color:#000000; font-family:adobe-clean, Arial, Helvetica, sans-serif; font-size:14px; line-height:20px; display:block; vertical-align:top;"/></td>
              </tr>
            </table>
          </td>
               </tr>
         <tr>
                <td class="header" style="color:#000000; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:60px; line-height:65px; padding-top:65px;">${h1}</td>
               </tr>
               <tr>
                <td style="color:#2C2C2C; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:18px; line-height:26px; padding-top:36px;">${heroCopy}</td>
               </tr>
               <tr>
                <td style="color:#1473E6; font-family:adobe-clean, Arial, Helvetica, sans-serif; font-size:15px; line-height:20px; padding-top:40px; padding-bottom:60px;"><div><!--[if mso]>
            <table class="full-width" align="left" width="200" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:200px;">
            <tr>
            <td height="40" valign="middle" style="background-color:#1473E6; font-family:Arial, Helvetica, sans-serif; height:40px;">
            <center>
            <![endif]-->
            <a class="button" href="${ctaLink}" target="_blank"
            style="background-color:#1473E6;border-radius:20px;color:#ffffff;display:inline-block;font-size:16px;line-height:40px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;"><strong>${ctaText}</strong></a>
            <!--[if mso]>
            </center>
            </td>
            </tr>
            </table>
          <![endif]--></div>
          </td>
               </tr>
              </table>
              <!-- END pod1 -->
           
         <!-- pod1 marquee -->
              <table class="full-width" align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:500px;">
               <tr>
                <td style="color:#000000; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:22px; line-height:28px; padding-bottom:100px;"><a href="https://illustrator.adobelanding.com/thr-illustration-gradients/?trackingid=<%=getTagId('CTA1')%>&mv=email" target="_blank" style="color:#1473E6;">
          <img class="mobile-image" 
                  alt="Get creative with color."
                   src="${mainImageSrc}"
          srcset="${mainImageSrc} 621w,
          ${mainImageSrc} 1200w"
          sizes="(max-width: 480px) 50vw"
          width="500" height="360" 
          border="0" hspace="0" vspace="0" style="color:#000000; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:22px; line-height:28px; display:block; vertical-align:top;"/>
          </a></td>
               </tr>
              </table>
              <!-- END pod1 marquee -->   
              
             <!-- END email content -->
             </td>
          </tr>
      <tr>
      <td bgcolor="#F5F5F5" style="background-color:#F5F5F5;">
        
       
        <!-- logo & social -->
        <table class="email-width" align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:500px;">
       <tr>
        <td valign="middle" style="padding-top:50px;">
          <div style="font-size:0;">
            <!--[if mso]>
            <table class="email-width" align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:500px;"><tr><td align="left" valign="middle" width="50%">
            <![endif]-->
            <div style="display:inline-block; vertical-align:middle; width:50%; min-width:250px; max-width:100%; width:-webkit-calc(230400px - 48000%); min-width:-webkit-calc(50%); width:calc(230400px - 48000%); min-width:calc(50%);">
            <!-- left -->
            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
             <tr>
              <td style="color:#FF3C00; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:12px; line-height:18px;"><img alt="Adobe" src="http://landing.adobe.com/dam/global/images/adobe-logo.classic.160x222.png" width="30" height="auto" border="0" hspace="0" vspace="0" style="color:#FF3C00; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:12px; line-height:18px; display:block; vertical-align:top;"/></td>
             </tr>
            </table>
            <!-- END left -->
            </div>
            <!--[if mso]>
            </td><td align="right" valign="middle" width="50%">
            <![endif]-->
            <div style="display:inline-block; vertical-align:middle; width:50%; min-width:250px; max-width:100%; width:-webkit-calc(230400px - 48000%); min-width:-webkit-calc(50%); width:calc(230400px - 48000%); min-width:calc(50%);">
            <!-- right -->
            <table class="social" align="right" width="auto" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:right;">
             <tr>
              <td style="color:#959595; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:12px; line-height:12px;"><a href="https://www.facebook.com/adobecreativecloud" alias="Facebook" target="_blank"><img class="social" alt="Facebook" src="http://landing.adobe.com/dam/global/images/social/facebook.959595.png" width="9" height="17" border="0" hspace="0" vspace="0" style="display:block; vertical-align:top;"/></a></td>
              <td width="36" style="width:36px;">&nbsp;</td>
              <td style="color:#959595; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:12px; line-height:12px;"><a href="https://www.instagram.com/adobecreativecloud" alias="Instagram" target="_blank"><img class="social" alt="Instagram" src="http://landing.adobe.com/dam/global/images/social/instagram.959595.png" width="17" height="17" border="0" hspace="0" vspace="0" style="display:block; vertical-align:top;"/></a></td>
              <td width="36" style="width:36px;">&nbsp;</td>
              <td style="color:#959595; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:12px; line-height:12px;"><a href="https://www.twitter.com/creativecloud" alias="Twitter" target="_blank"><img class="social" alt="Twitter" src="http://landing.adobe.com/dam/global/images/social/twitter.959595.png" width="21" height="17" border="0" hspace="0" vspace="0" style="display:block; vertical-align:top;"/></a></td>
             </tr>
            </table>
            <!-- END right -->
            </div>
          <!--[if mso]>
          </td></tr></table>
          <![endif]-->
          </div>
        </td>
         </tr>
        </table>      
        <!-- END logo & social -->
        
        <!-- legal-->
        <table class="email-width" align="center" width="500" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:500px;">
        <tr>
          <td class="legal" style="color:#959595; font-family:adobe-clean, Helvetica Neue, Helvetica, Verdana, Arial, sans-serif; font-size:11px; line-height:18px; padding-top:50px; padding-bottom:100px;">
        Adobe, the Adobe logo, Creative Cloud, and Illustrator are are either registered trademarks or trademarks of Adobe in the United States and/or other countries. All other trademarks are the property of their respective owners.<br/><br/>
        This is a marketing email from Adobe, 345 Park Avenue, San Jose, CA 95110 USA. Click here to <%@ include view='adbeGlobalMarketingComUnsubscriptionLink' %>. Please review the <a href="https://www.adobe.com/privacy.html" alias="FOOTER - Privacy Policy" target="_blank" style="color:#959595;">Adobe&nbsp;Privacy&nbsp;Policy</a>.<br/><br/>
        To ensure email delivery, add <a href="https://landing.adobe.com/dam/downloads/vcards/adobe.vcf" alias="Add to address book - mail@mail.adobe.com" target="_blank" style="color:#959595;">mail@mail.adobe.com</a> to your address book, contacts, or safe sender&nbsp;list.
        <% if ( document.mode != 'mirror' && document.mode != 'forward' ) { %><br/><br/><a href="<%@ include view='MirrorPageUrl' %>" alias="Read Online" target="_blank" style="color:#959595;">Read online</a><% } %></td>
        </tr>
        </table>
        <!-- END legal-->
        
      </td>
      </tr>
      </table>
      </td>
    </tr>
  </table>
  </body>
  </html>`;

  return email;
}

function createEmail() {
  const headerContent = document.querySelector('main > div:first-of-type');
  const mainImage = document.querySelector('main > div:last-of-type');
  const mainImageSrc = mainImage.querySelector('img').getAttribute('src');
  const h1 = headerContent.querySelector('h1').innerHTML;
  const heroCopy = headerContent.querySelector('p:first-of-type').innerText;
  const ctaText = headerContent.querySelector('a').innerText;
  const ctaLink = headerContent.querySelector('a').getAttribute('href');

  const inner = `
    <div class="preview-copy">
      <div class="preview-column">
        <h1>Copy your email</h1>
        <div><textarea>${wrapUp(h1, heroCopy, ctaText, ctaLink, mainImageSrc)}</textarea></div>
      </div>
      <div>
        <div class="preview-column">
          <h1>Preview Your Email</h1>
          ${wrapUp(h1, heroCopy, ctaText, ctaLink, mainImageSrc)}
        </div>
      </div>
    </div>
  `;

  document.querySelector('main').innerHTML = inner;
}

createEmail();

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    const $wrapper = createTag('div', { class: 'section-wrapper' });
    $div.parentNode.appendChild($wrapper);
    $wrapper.appendChild($div);
  });
}

async function decoratePage() {
  addDefaultClass('main>div');
  wrapSections('main>div');
  window.pages.decorated = true;
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', decoratePage);
} else {
  decoratePage();
}
