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

import { readFormConfig, setupForm } from '../../../pages/blocks/form/form.js';

const template = `<div class="form-container">
<form id="beta-form">
<div class="input-el">
  <label for="name"> First and Last Name</label>
  <input type="text" id="name" name="name" required/>
</div>

<div class="input-el">
  <label for="email">Your Adobe ID Email Address</label>
  <input type="email" name="email" class="emails" id="email" required/>
  <span class="emailerror hidden-default">Email fields must match.</span>
</div>

<div class="input-el">
  <label for="email2">Confirm your Adobe ID Email Address</label>
  <input type="email" name="email2" class="emails" id="email2" required/>
  <span class="emailerror hidden-default">Email fields must match.</span>
</div>

<div class="input-el">
  <label for="country"> Country of Residence</label>
  <select id="country" name="country" required/>
    <option>United States</option>
    <option>Afghanistan</option>
    <option>Albania</option>
    <option>Algeria</option>
    <option>American Samoa</option>
    <option>Andorra</option>
    <option>Angola</option>
    <option>Anguilla</option>
    <option>Antarctica</option>
    <option>Antigua and Barbuda</option>
    <option>Argentina</option>
    <option>Armenia</option>
    <option>Aruba</option>
    <option>Australia</option>
    <option>Austria</option>
    <option>Azerbaijan</option>
    <option>Bahamas</option>
    <option>Bahrain</option>
    <option>Bangladesh</option>
    <option>Barbados</option>
    <option>Belarus</option>
    <option>Belgium</option>
    <option>Belize</option>
    <option>Benin</option>
    <option>Bermuda</option>
    <option>Bhutan</option>
    <option>Bolivia</option>
    <option>Bosnia and Herzegovina</option>
    <option>Botswana</option>
    <option>Brazil</option>
    <option>British Indian Ocean</option>
    <option>Brunei</option>
    <option>Bulgaria</option>
    <option>Burkina Faso</option>
    <option>Burundi</option>
    <option>Cambodia</option>
    <option>Cameroon</option>
    <option>Canada</option>
    <option>Cape Verde</option>
    <option>Cayman Islands</option>
    <option>Central African Republic</option>
    <option>Chad</option>
    <option>Chile</option>
    <option>China</option>
    <option>Christmas Island</option>
    <option>Cocos (Keeling) Islands</option>
    <option>Colombia</option>
    <option>Comoros</option>
    <option>Congo, Republic of the</option>
    <option>Cook Islands</option>
    <option>Costa Rica</option>
    <option>Croatia</option>
    <option>Cyprus</option>
    <option>Czech Republic</option>
    <option>Democratic Republic of the Congo</option>
    <option>Denmark</option>
    <option>Djibouti</option>
    <option>Dominica</option>
    <option>Dominican Republic</option>
    <option>East Timor</option>
    <option>Ecuador</option>
    <option>Egypt</option>
    <option>El Salvador</option>
    <option>Equatorial Guinea</option>
    <option>Eritrea</option>
    <option>Estonia</option>
    <option>Ethiopia</option>
    <option>Falkland Islands (Malvinas)</option>
    <option>Faroe Islands</option>
    <option>Fiji</option>
    <option>Finland</option>
    <option>France</option>
    <option>French Guiana</option>
    <option>French Polynesia</option>
    <option>Gabon</option>
    <option>Gambia</option>
    <option>Georgia</option>
    <option>Germany</option>
    <option>Ghana</option>
    <option>Gibraltar</option>
    <option>Greece</option>
    <option>Greenland</option>
    <option>Grenada</option>
    <option>Guadeloupe</option>
    <option>Guatemala</option>
    <option>Guinea</option>
    <option>Guinea-Bissau</option>
    <option>Guyana</option>
    <option>Haiti</option>
    <option>Honduras</option>
    <option>Hong Kong SAR of China</option>
    <option>Hungary</option>
    <option>Iceland</option>
    <option>India</option>
    <option>Indonesia</option>
    <option>Iraq</option>
    <option>Ireland</option>
    <option>Israel</option>
    <option>Italy</option>
    <option>Ivory Coast (Côte d'Ivoire)</option>
    <option>Jamaica</option>
    <option>Japan</option>
    <option>Jordan</option>
    <option>Kazakhstan</option>
    <option>Kenya</option>
    <option>Kiribati</option>
    <option>Korea, South</option>
    <option>Kosovo</option>
    <option>Kuwait</option>
    <option>Kyrgyzstan</option>
    <option>Laos</option>
    <option>Latvia</option>
    <option>Lebanon</option>
    <option>Lesotho</option>
    <option>Liberia</option>
    <option>Libya</option>
    <option>Liechtenstein</option>
    <option>Lithuania</option>
    <option>Luxembourg</option>
    <option>Macau SAR of China</option>
    <option>Macedonia, Republic of</option>
    <option>Madagascar</option>
    <option>Malawi</option>
    <option>Malaysia</option>
    <option>Maldives</option>
    <option>Mali</option>
    <option>Malta</option>
    <option>Marshall Islands</option>
    <option>Martinique</option>
    <option>Mauritania</option>
    <option>Mauritius</option>
    <option>Mayotte</option>
    <option>Mexico</option>
    <option>Micronesia</option>
    <option>Moldova</option>
    <option>Monaco</option>
    <option>Mongolia</option>
    <option>Montenegro</option>
    <option>Montserrat</option>
    <option>Morocco</option>
    <option>Mozambique</option>
    <option>Myanmar</option>
    <option>Namibia</option>
    <option>Nauru</option>
    <option>Nepal</option>
    <option>Netherlands</option>
    <option>Netherlands Antilles</option>
    <option>New Caledonia</option>
    <option>New Zealand</option>
    <option>Nicaragua</option>
    <option>Niger</option>
    <option>Nigeria</option>
    <option>Niue</option>
    <option>Norfolk Island</option>
    <option>Norway</option>
    <option>Oman</option>
    <option>Pakistan</option>
    <option>Palestinian Territory</option>
    <option>Panama</option>
    <option>Papua New Guinea</option>
    <option>Paraguay</option>
    <option>Peru</option>
    <option>Philippines</option>
    <option>Pitcairn Island</option>
    <option>Poland</option>
    <option>Portugal</option>
    <option>Qatar</option>
    <option>Réunion</option>
    <option>Romania</option>
    <option>Russia</option>
    <option>Rwanda</option>
    <option>Saint Helena</option>
    <option>Saint Kitts and Nevis</option>
    <option>Saint Lucia</option>
    <option>Saint Pierre and Miquelon</option>
    <option>Saint Vincent and the Grenadines</option>
    <option>Samoa</option>
    <option>San Marino</option>
    <option>São Tome and Principe</option>
    <option>Saudi Arabia</option>
    <option>Senegal</option>
    <option>Serbia</option>
    <option>Seychelles</option>
    <option>Sierra Leone</option>
    <option>Singapore</option>
    <option>Slovakia</option>
    <option>Slovenia</option>
    <option>Solomon Islands</option>
    <option>Somalia</option>
    <option>South Africa</option>
    <option>South Georgia and the South Sandwich Islands</option>
    <option>Spain</option>
    <option>Sri Lanka</option>
    <option>Suriname</option>
    <option>Svalbard and Jan Mayen</option>
    <option>Swaziland</option>
    <option>Sweden</option>
    <option>Switzerland</option>
    <option>Taiwan Region</option>
    <option>Tajikistan</option>
    <option>Tanzania</option>
    <option>Thailand</option>
    <option>Togo</option>
    <option>Tokelau</option>
    <option>Tonga</option>
    <option>Trinidad and Tobago</option>
    <option>Tunisia</option>
    <option>Turkey</option>
    <option>Turkmenistan</option>
    <option>Turks and Caicos Islands</option>
    <option>Tuvalu</option>
    <option>Uganda</option>
    <option>Ukraine</option>
    <option>United Arab Emirates</option>
    <option>United Kingdom</option>
    <option>United States Minor Outlying Islands</option>
    <option>Uruguay</option>
    <option>Uzbekistan</option>
    <option>Vanuatu</option>
    <option>Vatican City</option>
    <option>Venezuela</option>
    <option>Vietnam</option>
    <option>Virgin Islands, British</option>
    <option>Wallis and Futuna</option>
    <option>Western Sahara</option>
    <option>Yemen</option>
    <option>Zambia</option>
    <option>Zimbabwe</option>
  </select>
</div>

<div class="radio-el">
  <span>What's your current Creative Cloud (CC) membership (purchased for yourself or your company)?</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="ccallapps" name="plan" value="All Apps" required/>
      <label for="ccallapps">Creative Cloud for Individuals: All Apps (Complete) (includes all creative desktop and mobile apps)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="ccpp" name="plan" value="Photography Plan" required/>
      <label for="ccpp">Creative Cloud for Individuals: Photography Plan (a subscription to Photoshop & Lightroom or Lightroom Plan with 1 TB)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="ccsingleapp" name="plan" value="Single App for Individuals" required/>
      <label for="ccsingleapp">Single App for Individuals (a subscription to one creative desktop app such as Premiere Pro, After Effects, Illustrator, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="ccteams" name="plan" value="Creative Cloud for Business (Teams)" required/>
      <label for="ccteams">Creative Cloud for Business (Teams) (either All Apps or Single App which includes a license management console and 24/7 tech support)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="ccenterprise" name="plan" value="Creative Cloud for Enterprise" required/>
      <label for="ccenterprise">Creative Cloud for Enterprise (for large organizations, & departments requiring enterprise grade capabilities)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="idontknow" name="plan" value="Do not know which version I have" required/>
      <label for="idontknow">Do not know which version I have</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="noplan" name="plan" value="No, I do not currently have a Creative Cloud paid membership" required/>
      <label for="noplan">No, I do not currently have a Creative Cloud paid membership</label>
    </div>
  </div>
</div>

<div class="radio-el">
  <span>Have you paid for transcription service in the past?</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="transcriptionyes" name="transcriptionpast" value="Yes" required/>
      <label for="transcriptionyes">Yes</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="transcriptionno" name="transcriptionpast" value="No" required/>
      <label for="transcriptionno">No</label>
    </div>
  </div>
</div>

<div class="radio-el">
  <span>How often do you create transcription and/or add captions to your video?</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="everydayt" name="frequencytranscription" value="Every day" required/>
      <label for="everydayt">Every day</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="afewtimeswkt" name="frequencytranscription" value="A few times a week" required/>
      <label for="afewtimeswkt">A few times a week</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="oncewkt" name="frequencytranscription" value="Once a week" required/>
      <label for="oncewkt">Once a week</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="twothreewks" name="frequencytranscription" value="Once every 2-3 weeks" required/>
      <label for="twothreewks">Once every 2-3 weeks</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="monthlyt" name="frequencytranscription" value="Once a month" required/>
      <label for="monthlyt">Once a month</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="lesst" name="frequencytranscription" value="Less than once a month/never" required/>
      <label for="lesst">Less than once a month/never</label>
    </div>
  </div>
</div>

<div class="radio-el">
  <span>How often do you create or edit video?</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="everydaye" name="frequencyedit" value="Every day" required/>
      <label for="everydaye">Every day</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="afewtimeswke" name="frequencyedit" value="A few times a week" required/>
      <label for="afewtimeswke">A few times a week</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="oncewke" name="frequencyedit" value="Once a week" required/>
      <label for="oncewke">Once a week</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="twothreewkse" name="frequencyedit" value="Once every 2-3 weeks" required/>
      <label for="twothreewkse">Once every 2-3 weeks</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="monthlye" name="frequencyedit" value="Once a month" required/>
      <label for="monthlye">Once a month</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="lesse" name="frequencyedit" value="Less than once a month/never" required/>
      <label for="lesse">Less than once a month/never</label>
    </div>
  </div>
</div>

<div class="radio-el">
    <span
  >Which of the following best describes your experience with creating and/or editing video?
    </span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="noexperience" name="experience" value="I have no experience" required/>
      <label for="noexperience">I have no experience at all</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="noediting" name="experience" value="I shoot but don't edit" required/>
      <label for="noediting">I shoot (or capture) video, but I don't do any video editing</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="basicskills" name="experience" value="I have some basic skills" required/>
      <label for="basicskills">I have some basic skills and do simple things like trim the beginning and end points of a clip</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="proficient" name="experience" value="I'm proficient" required/>
      <label for="proficient">I'm proficient – I do things like combine multiple clips or photos together, add titles, transitions, or filters</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="advanced" name="experience" value="I'm advanced" required/>
      <label for="advanced">I'm advanced – in addition to combining multiple clips, I do things like re-time clips and use keyframes, and may work with audio, motion graphics, color, and titles as well</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="expert" name="experience" value="I'm an expert" required/>
      <label for="expert">I'm an expert – I go deep technically and am the person others turn to when they have a question about video editing</label>
    </div>
  </div>
</div>

<div class="radio-el">
    <span>Are you willing to provide feedback to Premiere Pro regarding S2T?
    </span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="feedbackyes" name="feedback" value="Yes" required/>
      <label for="feedbackyes">Yes</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="feedbackno" name="feedback" value="No" required/>
      <label for="feedbackno">No</label>
    </div>
  </div>
</div>

<div class="radio-el">
    <span>For what purpose do you edit videos?
    </span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="work" name="purpose" value="For work purposes" required/>
      <label for="work">For work purposes</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hobby" name="purpose" value="For personal or hobby purposes" required/>
      <label for="hobby">For personal or hobby purposes</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="schoolwork" name="purpose" value="For my schoolwork as a student" required/>
      <label for="schoolwork">For my schoolwork as a student</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="volunteer" name="purpose" value="For volunteer work purposes" required/>
      <label for="volunteer">For volunteer work purposes</label>
    </div>
  </div>
</div>


<div id="work-purposes" class="radio-el hidden-default">
      <span>Please indicate which one type of video content you primarily create for work purposes.
  </span>
  <div class="radio-options-parent">
    <div class="radio-header">Media & Entertainment Content</div>
    <div class="radio-option">
      <input type="radio" id="documentaries" name="worktype" value="Documentaries"/>
      <label for="documentaries">Documentaries (films, series)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="liveprogramming" name="worktype" value="Live programming"/>
      <label for="liveprogramming">Live programming (live-audience programs, talk shows, live-event broadcast or specials)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="fiction" name="worktype" value="Fictional films or shows"/>
      <label for="fiction">Fictional films or shows (films, series)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="shortfilms" name="worktype" value="Short films"/>
      <label for="shortfilms">Short films</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="promos" name="worktype" value="Commercials, promos or trailers"/>
      <label for="promos">Commercials, promos or trailers</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="musicvideos" name="worktype" value="Music videos"/>
      <label for="musicvideos">Music videos</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="realityshows" name="worktype" value="Reality shows"/>
      <label for="realityshows">Reality shows</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="reporting" name="worktype" value="News & sports reporting"/>
      <label for="reporting">News & sports reporting</label>
    </div>
    <div class="radio-header">Business & Client Content</div>
    <div class="radio-option">
      <input type="radio" id="internalcomms" name="worktype" value="Internal communications"/>
      <label for="internalcomms">Internal communications videos</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hr" name="worktype" value="Human Resources videos"/>
      <label for="hr">Human Resources videos (hiring, training, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="eventvideos" name="worktype" value="Event videos"/>
      <label for="eventvideos">Event videos (recaps, behind-the-scenes, live stream, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="marketing" name="worktype" value="Product marketing videos"/>
      <label for="marketing">Product marketing videos (how-to, demos, unboxing, promos, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="sales" name="worktype" value="Sales pitch videos"/>
      <label for="sales">Sales pitch videos</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="socialspecific" name="worktype" value="Social media-specific videos"/>
      <label for="socialspecific">Social media-specific videos (branded vlogs, IG Stories, etc.)</label>
    </div>
  </div>
</div>


<div class="radio-el">
      <span>Where is the video content that you create shared?
      </span>
  <span><em>Select all that apply.</em></span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="checkbox" id="filmfestivals" name="whereshared" value="Film festival(s)"/>
      <label for="filmfestivals">Film festival(s)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="movietheater" name="whereshared" value="Movie theater"/>
      <label for="movietheater">Movie theater</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialvideo" name="whereshared" value="Social video sharing sites" class="socialtrigger"/>
      <label for="socialvideo">Social video sharing sites (YouTube, Vimeo, TikTok, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialnetworking" name="whereshared" value="Social networking sites" class="socialtrigger"/>
      <label for="socialnetworking">Social networking sites (Facebook, Instagram, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="broadcasttv" name="whereshared" value="Broadcast TV"/>
      <label for="broadcasttv">Broadcast TV</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="streaming" name="whereshared" value="Streaming entertainment platforms"/>
      <label for="streaming">Streaming entertainment platforms (Netflix, Hulu, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="livestreaming" name="whereshared" value="Film festival(s)"/>
      <label for="livestreaming">Live streaming sites (Twitch, Ustream, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="publicwebsite" name="whereshared" value="Public website"/>
      <label for="publicwebsite">Public website</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="intranet" name="whereshared" value="Intranet"/>
      <label for="intranet">Intranet</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="paideducation" name="whereshared" value="Paid educational platforms"/>
      <label for="paideducation">Paid educational platforms</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="atwork" name="whereshared" value="At work"/>
      <label for="atwork">In-person or remote at work (company meeting, work presentation, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="atschool" name="whereshared" value="At school"/>
      <label for="atschool">In-person or remote at school (class project, presentation, etc.)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="privately" name="whereshared" value="Privately with friends/family"/>
      <label for="privately">Privately with friends/family</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="other" name="whereshared" value="Other"/>
      <label for="other">Other (specify)</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="notshared" name="whereshared" value="The videos are not shared"/>
      <label for="notshared">The videos are not shared</label>
    </div>
  </div>
</div>


<div id="social-reason" class="radio-el hidden-default">
      <span>You mentioned that you create videos for social media. Please select the reason(s) you create videos for social media.
    </span>
  <span><em>Select all that apply.</em></span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="checkbox" id="socialfollowers" name="socialreason" value="To share with my followers"/>
      <label for="socialfollowers">To share with my followers/community on my public-facing channel</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialfriends" name="socialreason" value="Friends/family"/>
      <label for="socialfriends">To share with friends/family</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialotherindividual" name="socialreason" value="For another individual"/>
      <label for="socialotherindividual">For another individual who has a public-facing channel</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialwork" name="socialreason" value="For a company, organization, or client"/>
      <label for="socialwork">For the company or organization at which I'm employed or for a client</label>
    </div>
    <div class="radio-option">
      <input type="checkbox" id="socialnone" name="socialreason" value="None of the above"/>
      <label for="socialnone">None of the above</label>
    </div>
  </div>
</div>

<div class="radio-el">
  <span>Which of the following best describes your employment status?</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="employed" name="employmentstatus" value="Employed" required/>
      <label for="employed">Employed (in a company, agency, or other organization)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="selfemployed" name="employmentstatus" value="Self-employed" required/>
      <label for="selfemployed">Self-employed (including freelancer / consultant)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="homemaker" name="employmentstatus" value="Homemaker" required/>
      <label for="homemaker">Homemaker</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="retired" name="employmentstatus" value="Retired" required/>
      <label for="retired">Retired</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="unemployed" name="employmentstatus" value="Not currently employed" required/>
      <label for="unemployed">Not currently employed</label>
    </div>
  </div>
</div>


<div id="profession" class="radio-el hidden-default">
  <span>Does any of the following describe your profession?</span>
  <span>If you do multiple creative job functions, please select the one you primarily do.</span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="visualgraphic" name="profession" value="Visual or graphic designer"/>
      <label for="visualgraphic">Visual or graphic designer</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="illustrator" name="profession" value="Illustrator"/>
      <label for="illustrator">Illustrator</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="print" name="profession" value="Print designer/publisher"/>
      <label for="print">Print designer/publisher</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="photographer" name="profession" value="Photographer"/>
      <label for="photographer">Photographer</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="videoaudio" name="profession" value="Video/audio professional"/>
      <label for="videoaudio">Video/audio professional</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="animationmotion" name="profession" value="Animator/motion graphic designer"/>
      <label for="animationmotion">Animator/motion graphic designer</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="webdesigner" name="profession" value="Web designer"/>
      <label for="webdesigner">Web designer (web designer, game designer, interactive designer)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="professionux" name="profession" value="UX designer"/>
      <label for="professionux">UX designer</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="professionsoftware" name="profession" value="Software developer"/>
      <label for="professionsoftware">Software developer (apps, mobile, games, web apps, server)</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="professionno" name="profession" value="No, none of these"/>
      <label for="professionno">No, none of these</label>
    </div>
  </div>
</div>


<div class="radio-el">
    <span>How did you hear about the Speech-to-text early access program?
    </span>
  <div class="radio-options-parent">
    <div class="radio-option">
      <input type="radio" id="hearmax" name="howdidyouhear" value="Adobe MAX" required/>
      <label for="hearmax">Adobe MAX</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hearyoutube" name="howdidyouhear" value="YouTube" required/>
      <label for="hearyoutube">YouTube</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hearfacebook" name="howdidyouhear" value="Facebook" required/>
      <label for="hearfacebook">Facebook</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hearblog" name="howdidyouhear" value="Blog posts" required/>
      <label for="hearblog">Blog posts</label>
    </div>
    <div class="radio-option">
      <input type="radio" id="hearpremiere" name="howdidyouhear" value="Twitter" required/>
      <label for="hearpremiere">Twitter</label>
    </div>
  </div>
</div>

<p class="legal-text">The Adobe family of companies may keep me informed with personalized emails about Adobe Premiere Pro Speech to Text. See our <a href="https://www.adobe.com/privacy.html">Privacy Policy</a> for more details or to opt-out at any time.</p>

<div class="submit-el">
  <input type="submit" value="Submit application"/>
</div>
</form>
</div>`;

/** @type {($form: HTMLDivElement) => void} */
function initForm($form, config) {
  const purposerad = $form.purpose;
  for (let i = 0; i < purposerad.length; i += 1) {
    purposerad[i].addEventListener('change', () => {
      const element = document.getElementById('work-purposes');
      const purposes = document.getElementsByName('worktype');
      if (this.value === 'For work purposes') {
        element.classList.add('revealed');
        for (let j = 0; j < purposes.length; j += 1) {
          purposes[j].required = true;
        }
      } else {
        element.classList.remove('revealed');
        for (let j = 0; j < purposes.length; j += 1) {
          purposes[j].checked = false;
          purposes[j].required = false;
        }
      }
    });
  }

  const sharedcheckboxes = document.getElementsByClassName('socialtrigger');
  for (let i = 0; i < sharedcheckboxes.length; i += 1) {
    sharedcheckboxes[i].addEventListener('change', () => {
      const socelement = document.getElementById('social-reason');
      if (document.querySelector('.socialtrigger:checked') !== null) {
        socelement.classList.add('revealed');
      } else {
        socelement.classList.remove('revealed');
        const reasons = document.getElementsByName('socialreason');
        for (let j = 0; j < reasons.length; j += 1) {
          reasons[j].checked = false;
        }
      }
    });
  }

  const employmentrad = $form.employmentstatus;
  for (let i = 0; i < employmentrad.length; i += 1) {
    employmentrad[i].addEventListener('change', function () {
      const element = document.getElementById('profession');
      const purposes = document.getElementsByName('profession');
      if (this.value === 'Employed' || this.value === 'Self-employed') {
        element.classList.add('revealed');
        for (let j = 0; j < purposes.length; j += 1) {
          purposes[j].required = true;
        }
      } else {
        element.classList.remove('revealed');
        for (let j = 0; j < purposes.length; j += 1) {
          purposes[j].checked = false;
          purposes[j].required = false;
        }
      }
    });
  }

  function validateCheckboxes() {
    // ensure that at least one sharing checkbox is selected
    document.getElementById('filmfestivals').setCustomValidity('');
    if (!$form.querySelector('input[name=whereshared]:checked')) {
      document.getElementById('filmfestivals').setCustomValidity('Please select at least one checkbox.');
    }

    // ensure that at least one socialtrigger checkbox is selected
    document.getElementById('socialfollowers').setCustomValidity('');
    if ($form.querySelector('.socialtrigger:checked') && !$form.querySelector('input[name=socialreason]:checked')) {
      document.getElementById('socialfollowers').setCustomValidity('Please select at least one checkbox.');
    }
  }

  setupForm({
    formId: 'beta-form',
    config,
    preValidation: validateCheckboxes,
  });
}

/** @type {import("../../component").ComponentDecorator} */
export default function decorate(blockEl) {
  const config = readFormConfig(blockEl);
  blockEl.innerHtml = template;
  document.getElementsByTagName('body')[0].classList.add('has-beta-form');
  const $form = document.getElementById('beta-form');
  initForm($form, config);
}
