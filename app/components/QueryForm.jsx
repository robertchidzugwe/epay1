"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

const API_BASE_URL = "https://kwale-hris-api.onrender.com";

const HARDCODED_FEES = [
  { Id: "1", FeeName: "Medium Trader, Shop or Retail Service: From 5 to 20 employees and/or premises from 50 to 300 m2. Fair location", FFAFeeName: "Medium Trader, Shop or Retail Service: From 5 to 20 employees and/or premises from 50 to 300 m2. Fair location", FeeAmount: 4000 },
  { Id: "2", FeeName: "Kiosk Light or Temporary Construction: Less than 5 m2.", FFAFeeName: "Kiosk Light or Temporary Construction: Less than 5 m2.", FeeAmount: 1600 },
  { Id: "3", FeeName: "Small Trader, Shop or Retail Service: Up to 4 employees and/or premises less than 50 m2 in far away location.", FFAFeeName: "Small Trader, Shop or Retail Service: Up to 4 employees and/or premises less than 50 m2 in far away location.", FeeAmount: 2000 },
  { Id: "4", FeeName: "Large Trader, Shop, Retail Store or Personal Service: From 21 to 100 employees and/or Premises from 300 to 3000 m2 in fair location", FFAFeeName: "Large Trader, Shop, Retail Store or Personal Service: From 21 to 100 employees and/or Premises from 300 to 3000 m2 in fair location", FeeAmount: 8000 },
  { Id: "5", FeeName: "Mega Store, Hypermarket: Large multi-department store, hypermarket over 100 employees or premises over 3,000 m2 in prime location", FFAFeeName: "Mega Store, Hypermarket: Large multi-department store, hypermarket over 100 employees or premises over 3,000 m2 in prime location", FeeAmount: 90000 },
  { Id: "6", FeeName: "Other Wholesale-Retail Traders, Stores, Shops and Services", FFAFeeName: "Other Wholesale-Retail Traders, Stores, Shops and Services", FeeAmount: 1600 },
  { Id: "7", FeeName: "Small Informal Sector Trader / Service Provider: Shoeshine, shoe repair, street vendor (newspapers, sweets, soda, cigarettes).", FFAFeeName: "Small Informal Sector Trader / Service Provider: Shoeshine, shoe repair, street vendor (newspapers, sweets, soda, cigarettes).", FeeAmount: 800 },
  { Id: "8", FeeName: "Semi Permanent Informal Sector Trader: Up to 2 persons operating in verandah or temporary building.", FFAFeeName: "Semi Permanent Informal Sector Trader: Up to 2 persons operating in verandah or temporary building.", FeeAmount: 1200 },
  { Id: "9", FeeName: "Hawker without Motor Vehicle: 1 person without motor vehicle.", FFAFeeName: "Hawker without Motor Vehicle: 1 person without motor vehicle.", FeeAmount: 1600 },
  { Id: "10", FeeName: "Hawker with Motor Vehicle: 1 person with motor vehicle.", FFAFeeName: "Hawker with Motor Vehicle: 1 person with motor vehicle.", FeeAmount: 2000 },
  { Id: "11", FeeName: "Independent Transport Operator: 1 vehicle.", FFAFeeName: "Independent Transport Operator: 1 vehicle.", FeeAmount: 2000 },
  { Id: "12", FeeName: "Other Transport, Storage, and Communications", FFAFeeName: "Other Transport, Storage, and Communications", FeeAmount: 2800 },
  { Id: "13", FeeName: "Medium Petrol Filling Station: From 4 to 6 pumps or with garage-workshop or retail shop.", FFAFeeName: "Medium Petrol Filling Station: From 4 to 6 pumps or with garage-workshop or retail shop.", FeeAmount: 14800 },
  { Id: "14", FeeName: "Medium Cold Storage Facility: Between 100-1,000 m2.", FFAFeeName: "Medium Cold Storage Facility: Between 100-1,000 m2.", FeeAmount: 50000 },
  { Id: "15", FeeName: "Medium Transport Company: From 6 to 30 vehicles.", FFAFeeName: "Medium Transport Company: From 6 to 30 vehicles.", FeeAmount: 44800 },
  { Id: "16", FeeName: "Large Petrol Filling Station: Over 6 pumps or with garage-workshop & retail shop.", FFAFeeName: "Large Petrol Filling Station: Over 6 pumps or with garage-workshop & retail shop.", FeeAmount: 30000 },
  { Id: "17", FeeName: "Large Transportation Company: Over 30 vehicles.", FFAFeeName: "Large Transportation Company: Over 30 vehicles.", FeeAmount: 120000 },
  { Id: "18", FeeName: "Small Petrol Filling Station: Up to 3 pumps and without garage-workshop or retail shop.", FFAFeeName: "Small Petrol Filling Station: Up to 3 pumps and without garage-workshop or retail shop.", FeeAmount: 2800 },
  { Id: "19", FeeName: "Small Storage Facility: Up to 1,000 m2.", FFAFeeName: "Small Storage Facility: Up to 1,000 m2.", FeeAmount: 4000 },
  { Id: "20", FeeName: "Small Transport Company: From 2 to 5 vehicles.", FFAFeeName: "Small Transport Company: From 2 to 5 vehicles.", FeeAmount: 4000 },
  { Id: "21", FeeName: "Large Storage Facility: Over 5,000 m2. Godown, Warehouse. Liquid Storage Tanks Complex.", FFAFeeName: "Large Storage Facility: Over 5,000 m2. Godown, Warehouse. Liquid Storage Tanks Complex.", FeeAmount: 74800 },
  { Id: "22", FeeName: "Medium Communications Co.: From 16 to 100 employees and/or Premises from 1,500 to 5,000 m2.", FFAFeeName: "Medium Communications Co.: From 16 to 100 employees and/or Premises from 1,500 to 5,000 m2.", FeeAmount: 82400 },
  { Id: "23", FeeName: "Small Communications Co.: Up to 15 employees and/or Premises up to 1,500 m2.", FFAFeeName: "Small Communications Co.: Up to 15 employees and/or Premises up to 1,500 m2.", FeeAmount: 12000 },
  { Id: "24", FeeName: "Small Cold Storage Facility: Up to 100 m2.", FFAFeeName: "Small Cold Storage Facility: Up to 100 m2.", FeeAmount: 4800 },
  { Id: "25", FeeName: "Booking Office", FFAFeeName: "Booking Office", FeeAmount: 18000 },
  { Id: "26", FeeName: "Medium Storage Facility: From 1,000 to 5,000 m2.", FFAFeeName: "Medium Storage Facility: From 1,000 to 5,000 m2.", FeeAmount: 30000 },
  { Id: "27", FeeName: "Small Agricultural Producer/Processor/Dealer: Up to 10 employees.", FFAFeeName: "Small Agricultural Producer/Processor/Dealer: Up to 10 employees.", FeeAmount: 3200 },
  { Id: "28", FeeName: "Medium Agricultural Producer/Processor/Dealer/Exporter: From 11 to 50 employees.", FFAFeeName: "Medium Agricultural Producer/Processor/Dealer/Exporter: From 11 to 50 employees.", FeeAmount: 37200 },
  { Id: "29", FeeName: "Large Mining or Natural Resources Extraction Operation: Over 50 employees.", FFAFeeName: "Large Mining or Natural Resources Extraction Operation: Over 50 employees.", FeeAmount: 1000000 },
  { Id: "30", FeeName: "Medium Mining or Natural Resources Extraction Operation: From 4 to 50 employees.", FFAFeeName: "Medium Mining or Natural Resources Extraction Operation: From 4 to 50 employees.", FeeAmount: 67200 },
  { Id: "31", FeeName: "Small Mining or Natural Resources Extraction Operation: Up to 3 employees. Includes quarries & small mining operations.", FFAFeeName: "Small Mining or Natural Resources Extraction Operation: Up to 3 employees. Includes quarries & small mining operations.", FeeAmount: 37200 },
  { Id: "32", FeeName: "Other Agricultural, Forestry, and Natural Resources", FFAFeeName: "Other Agricultural, Forestry, and Natural Resources", FeeAmount: 3200 },
  { Id: "33", FeeName: "Large Agricultural Producer/Processor/Dealer/Exporter: Over 50 employees.", FFAFeeName: "Large Agricultural Producer/Processor/Dealer/Exporter: Over 50 employees.", FeeAmount: 90800 },
  { Id: "34", FeeName: "Large Bar/Traditional Beer Seller: Capacity over 50 customers.", FFAFeeName: "Large Bar/Traditional Beer Seller: Capacity over 50 customers.", FeeAmount: 14000 },
  { Id: "35", FeeName: "Other Catering and Accommodation", FFAFeeName: "Other Catering and Accommodation", FeeAmount: 2800 },
  { Id: "36", FeeName: "Medium Bar/Traditional Beer Seller: Capacity up to 15 customers.", FFAFeeName: "Medium Bar/Traditional Beer Seller: Capacity up to 15 customers.", FeeAmount: 3200 },
  { Id: "37", FeeName: "Small Lodging House with Restaurant and/or Bar B/C Class: Basic standard up to 5 rooms.", FFAFeeName: "Small Lodging House with Restaurant and/or Bar B/C Class: Basic standard up to 5 rooms.", FeeAmount: 15000 },
  { Id: "38", FeeName: "Large Night Club / Casino: Over 500 m2.", FFAFeeName: "Large Night Club / Casino: Over 500 m2.", FeeAmount: 20000 },
  { Id: "39", FeeName: "Large Lodging House with Restaurant and/or Bar B/C Class: Basic standard over 15 rooms.", FFAFeeName: "Large Lodging House with Restaurant and/or Bar B/C Class: Basic standard over 15 rooms.", FeeAmount: 30000 },
  { Id: "40", FeeName: "Medium Night Club/Casino: From 101 to 500 m2.", FFAFeeName: "Medium Night Club/Casino: From 101 to 500 m2.", FeeAmount: 12000 },
  { Id: "41", FeeName: "Small Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity up to 5 customers.", FFAFeeName: "Small Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity up to 5 customers.", FeeAmount: 3000 },
  { Id: "42", FeeName: "Medium Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity from 6 to 20 customers.", FFAFeeName: "Medium Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity from 6 to 20 customers.", FeeAmount: 6000 },
  { Id: "43", FeeName: "Large Lodging House B/C Class: Basic standard over 15 rooms.", FFAFeeName: "Large Lodging House B/C Class: Basic standard over 15 rooms.", FeeAmount: 25000 },
  { Id: "44", FeeName: "Large Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity over 20 customers.", FFAFeeName: "Large Eating House; Snack Bar; Tea House \"Hotel\": No lodging and no alcohol served with capacity over 20 customers.", FeeAmount: 12000 },
  { Id: "45", FeeName: "Medium Lodging House with Restaurant and/or Bar B/C Class: Basic standard from 6 to 15 rooms.", FFAFeeName: "Medium Lodging House with Restaurant and/or Bar B/C Class: Basic standard from 6 to 15 rooms.", FeeAmount: 20000 },
  { Id: "46", FeeName: "Large Restaurant with Bar/Membership Club: Capacity over 30 customers/members.", FFAFeeName: "Large Restaurant with Bar/Membership Club: Capacity over 30 customers/members.", FeeAmount: 20000 },
  { Id: "47", FeeName: "Large-High Standard Lodging House/Hotel D Class: Over 100 rooms.", FFAFeeName: "Large-High Standard Lodging House/Hotel D Class: Over 100 rooms.", FeeAmount: 200000 },
  { Id: "48", FeeName: "Small Night Club/Casino: Up to 100 m2.", FFAFeeName: "Small Night Club/Casino: Up to 100 m2.", FeeAmount: 8000 },
  { Id: "49", FeeName: "Small Lodging House B/C Class: Basic standard up to 5 rooms.", FFAFeeName: "Small Lodging House B/C Class: Basic standard up to 5 rooms.", FeeAmount: 10000 },
  { Id: "50", FeeName: "Small-High Standard Lodging House/Hotel D Class: Up to 40 rooms.", FFAFeeName: "Small-High Standard Lodging House/Hotel D Class: Up to 40 rooms.", FeeAmount: 50000 },
  { Id: "51", FeeName: "Medium Lodging House B/C Class: Basic standard from 6 to 15 rooms.", FFAFeeName: "Medium Lodging House B/C Class: Basic standard from 6 to 15 rooms.", FeeAmount: 15000 },
  { Id: "52", FeeName: "Butchery with Roasted Meat and/or Soup Kitchen: Any size.", FFAFeeName: "Butchery with Roasted Meat and/or Soup Kitchen: Any size.", FeeAmount: 6000 },
  { Id: "53", FeeName: "Medium Bar/Traditional Beer Seller: Capacity from 16 to 50 customers.", FFAFeeName: "Medium Bar/Traditional Beer Seller: Capacity from 16 to 50 customers.", FeeAmount: 10000 },
  { Id: "54", FeeName: "Medium-High Standard Lodging House / Hotel D Class: From 41 to 100 rooms.", FFAFeeName: "Medium-High Standard Lodging House / Hotel D Class: From 41 to 100 rooms.", FeeAmount: 120000 },
  { Id: "55", FeeName: "Medium Restaurant with Bar/Membership Club: Capacity from 11 to 30 customers/members.", FFAFeeName: "Medium Restaurant with Bar/Membership Club: Capacity from 11 to 30 customers/members.", FeeAmount: 15000 },
  { Id: "56", FeeName: "Small Restaurant with Bar Up to 10 customers", FFAFeeName: "Small Restaurant with Bar Up to 10 customers", FeeAmount: 4000 },
  { Id: "57", FeeName: "Medical Health certificate", FFAFeeName: "Medical Health certificate", FeeAmount: 200 },
  { Id: "58", FeeName: "Lorries Above 5 Tons", FFAFeeName: "Lorries Above 5 Tons", FeeAmount: 250 },
  { Id: "59", FeeName: "Small Professional Services Firm: Up to 2 practitioners.", FFAFeeName: "Small Professional Services Firm: Up to 2 practitioners.", FeeAmount: 30000 },
  { Id: "60", FeeName: "Other Professional & Technical Services", FFAFeeName: "Other Professional & Technical Services", FeeAmount: 2800 },
  { Id: "61", FeeName: "Small Financial Services: Up to 5 employees.", FFAFeeName: "Small Financial Services: Up to 5 employees.", FeeAmount: 75000 },
  { Id: "62", FeeName: "Medium Professional Services Firm: From 3 to 10 practitioners.", FFAFeeName: "Medium Professional Services Firm: From 3 to 10 practitioners.", FeeAmount: 85000 },
  { Id: "63", FeeName: "Large Financial Services: Over 25 employees or premises over 300 m2.", FFAFeeName: "Large Financial Services: Over 25 employees or premises over 300 m2.", FeeAmount: 150000 },
  { Id: "64", FeeName: "Medium Financial Services: From 6 to 25 employees.", FFAFeeName: "Medium Financial Services: From 6 to 25 employees.", FeeAmount: 110000 },
  { Id: "65", FeeName: "Independent Technical Operator: One person acting individually (typist, accountant, bookkeeper, etc).", FFAFeeName: "Independent Technical Operator: One person acting individually (typist, accountant, bookkeeper, etc).", FeeAmount: 10000 },
  { Id: "66", FeeName: "Large Professional Services Firm: Over 10 practitioners and/or International affiliation.", FFAFeeName: "Large Professional Services Firm: Over 10 practitioners and/or International affiliation.", FeeAmount: 135000 },
  { Id: "67", FeeName: "Small Private Educational Facility: Up to 30 pupils or fees up to KSh 30,000 per year.", FFAFeeName: "Small Private Educational Facility: Up to 30 pupils or fees up to KSh 30,000 per year.", FeeAmount: 4000 },
  { Id: "68", FeeName: "Private Higher Education Institution: Any type of private university, college or higher education institution.", FFAFeeName: "Private Higher Education Institution: Any type of private university, college or higher education institution.", FeeAmount: 18000 },
  { Id: "69", FeeName: "Small Entertainment Facility", FFAFeeName: "Small Entertainment Facility", FeeAmount: 6000 },
  { Id: "70", FeeName: "Other Education, Health, and Entertainment Services", FFAFeeName: "Other Education, Health, and Entertainment Services", FeeAmount: 3200 },
  { Id: "71", FeeName: "Small Entertainment Facility: Up to 50 seats; up to 3 machines; up to 15 members.", FFAFeeName: "Small Entertainment Facility: Up to 50 seats; up to 3 machines; up to 15 members.", FeeAmount: 6000 },
  { Id: "72", FeeName: "Medium Private Education Institution: From 31 to 100 pupils or fees from KSH 30,001 to KSh 50,000 per year.", FFAFeeName: "Medium Private Education Institution: From 31 to 100 pupils or fees from KSH 30,001 to KSh 50,000 per year.", FeeAmount: 6000 },
  { Id: "73", FeeName: "Small Private Health Facility: Providing overnight accommodation with capacity up to 10 beds.", FFAFeeName: "Small Private Health Facility: Providing overnight accommodation with capacity up to 10 beds.", FeeAmount: 12000 },
  { Id: "74", FeeName: "Medium Private Health Facility: Providing overnight accommodation with capacity from 11 to 30 beds.", FFAFeeName: "Medium Private Health Facility: Providing overnight accommodation with capacity from 11 to 30 beds.", FeeAmount: 18000 },
  { Id: "75", FeeName: "Health Clinic/Doctor's Surgery: Doctor-Dentist-Physiotherapist-Psychologist-etc Consult Office with no overnight accommodation available.", FFAFeeName: "Health Clinic/Doctor's Surgery: Doctor-Dentist-Physiotherapist-Psychologist-etc Consult Office with no overnight accommodation available.", FeeAmount: 4000 },
  { Id: "76", FeeName: "Large Private Health Facility: Hospital, Clinic, Nursing Home (providing overnight accommodation with capacity over 30 beds), Funeral Home.", FFAFeeName: "Large Private Health Facility: Hospital, Clinic, Nursing Home (providing overnight accommodation with capacity over 30 beds), Funeral Home.", FeeAmount: 28000 },
  { Id: "77", FeeName: "Medium Entertainment Facility: From 50 to 100 seats; from 4 to 10 machines; from 16 to 50 members.", FFAFeeName: "Medium Entertainment Facility: From 50 to 100 seats; from 4 to 10 machines; from 16 to 50 members.", FeeAmount: 37200 },
  { Id: "78", FeeName: "Large Entertainment Facility: Cinema-Theatre-Video Show (over 100 seats), Amusement-Juke Box-Games Machines Arcades (over 10 machines), Sports Club-Gym (Over 50 members).", FFAFeeName: "Large Entertainment Facility: Cinema-Theatre-Video Show (over 100 seats), Amusement-Juke Box-Games Machines Arcades (over 10 machines), Sports Club-Gym (Over 50 members).", FeeAmount: 67200 },
  { Id: "79", FeeName: "Large Private Education Institution: Over 100 pupils or fees over KSh. 50,000 per year.", FFAFeeName: "Large Private Education Institution: Over 100 pupils or fees over KSh. 50,000 per year.", FeeAmount: 12000 },
  { Id: "80", FeeName: "Small Workshop/Service-Repair Contractor: Up to 5 employees or premises up to 25 m2.", FFAFeeName: "Small Workshop/Service-Repair Contractor: Up to 5 employees or premises up to 25 m2.", FeeAmount: 2800 },
  { Id: "81", FeeName: "Medium Workshop/Service-Repair Contractor: From 6 to 20 employees or premises from 25 m2 to 500 m2.", FFAFeeName: "Medium Workshop/Service-Repair Contractor: From 6 to 20 employees or premises from 25 m2 to 500 m2.", FeeAmount: 40000 },
  { Id: "82", FeeName: "Large Industrial Plant: Over 75 employees or premises over 2,500 m2.", FFAFeeName: "Large Industrial Plant: Over 75 employees or premises over 2,500 m2.", FeeAmount: 150000 },
  { Id: "83", FeeName: "Small Industrial Plant: Up to 15 employees or premises up to 100 m2.", FFAFeeName: "Small Industrial Plant: Up to 15 employees or premises up to 100 m2.", FeeAmount: 16000 },
  { Id: "84", FeeName: "Large Workshop/Service-Repair Contractor: Over 20 employees or premises over 500 m2.", FFAFeeName: "Large Workshop/Service-Repair Contractor: Over 20 employees or premises over 500 m2.", FeeAmount: 90000 },
  { Id: "85", FeeName: "Other Manufacturer, Workshop, Factory, Contractor", FFAFeeName: "Other Manufacturer, Workshop, Factory, Contractor", FeeAmount: 2800 },
  { Id: "86", FeeName: "Application/ Renewal Fees", FFAFeeName: "Application/ Renewal Fees", FeeAmount: 100 },
  { Id: "87", FeeName: "ANNUAL RATES", FFAFeeName: "ANNUAL RATES", FeeAmount: 2 },
  { Id: "88", FeeName: "ACCUMULATED PENALTIES", FFAFeeName: "ACCUMULATED PENALTIES", FeeAmount: 2 },
  { Id: "89", FeeName: "LAND RATES ARREARS", FFAFeeName: "LAND RATES ARREARS", FeeAmount: 1 },
  { Id: "90", FeeName: "SUSPENSION FEE", FFAFeeName: "SUSPENSION FEE", FeeAmount: 2000 },
  { Id: "91", FeeName: "Plot Sub Division Fee", FFAFeeName: "Plot Sub Division Fee", FeeAmount: 2500 },
  { Id: "92", FeeName: "LAND RATES ARREARS BF", FFAFeeName: "LAND RATES ARREARS BF", FeeAmount: 0 },
  { Id: "93", FeeName: "LAND RATE ACCUMULATED PENALTIES", FFAFeeName: "LAND RATE ACCUMULATED PENALTIES", FeeAmount: 2 },
  { Id: "94", FeeName: "Market Stall Rent - Other Centres", FFAFeeName: "Market Stall Rent - Other Centres", FeeAmount: 400 },
  { Id: "95", FeeName: "Market Stalls Rent - Major Towns", FFAFeeName: "Market Stalls Rent - Major Towns", FeeAmount: 1500 },
  { Id: "96", FeeName: "Posters/ Fliers (up to 1000 Copies)", FFAFeeName: "Posters/ Fliers (up to 1000 Copies)", FeeAmount: 5000 },
  { Id: "97", FeeName: "Category \"a\" House", FFAFeeName: "Category \"a\" House", FeeAmount: 6000 },
  { Id: "98", FeeName: "Category \"c\"/ 2 Bedroom House", FFAFeeName: "Category \"c\"/ 2 Bedroom House", FeeAmount: 3000 },
  { Id: "99", FeeName: "House Rent - 1 Bedroom House", FFAFeeName: "House Rent - 1 Bedroom House", FeeAmount: 2500 },
{ Id: "100", FeeName: "House Rent 1R/SQ", FFAFeeName: "House Rent 1R/SQ", FeeAmount: 1200 },
  { Id: "101", FeeName: "Re-opening charges - Rental house", FFAFeeName: "Re-opening charges - Rental house", FeeAmount: 500 },
  { Id: "102", FeeName: "House rent - 3 roomed house", FFAFeeName: "House rent - 3 roomed house", FeeAmount: 4500 },
  { Id: "103", FeeName: "Stall Rent No 1", FFAFeeName: "Stall Rent No 1", FeeAmount: 2000 },
  { Id: "104", FeeName: "Category \"b\" / 3 Bedroom House", FFAFeeName: "Category \"b\" / 3 Bedroom House", FeeAmount: 4500 },
  { Id: "105", FeeName: "House rent - Middle class house \"c\" category", FFAFeeName: "House rent - Middle class house \"c\" category", FeeAmount: 3000 },
  { Id: "106", FeeName: "Posters/ Fliers per copy", FFAFeeName: "Posters/ Fliers per copy", FeeAmount: 15 },
  { Id: "107", FeeName: "Noise Control License Fees", FFAFeeName: "Noise Control License Fees", FeeAmount: 5500 },
  { Id: "108", FeeName: "PLOT RENT ARREARS", FFAFeeName: "PLOT RENT ARREARS", FeeAmount: 0 },
  { Id: "109", FeeName: "Annual rent - Other ares", FFAFeeName: "Annual rent - Other ares", FeeAmount: 1000 },
  { Id: "110", FeeName: "Branded Umbrella monthly charge per one", FFAFeeName: "Branded Umbrella monthly charge per one", FeeAmount: 500 },
  { Id: "111", FeeName: "VEHICLE BRANDING FEE", FFAFeeName: "VEHICLE BRANDING FEE", FeeAmount: 8000 },
  { Id: "112", FeeName: "NAME PANNELS", FFAFeeName: "NAME PANNELS", FeeAmount: 0 },
  { Id: "113", FeeName: "Auction fees - Cattle", FFAFeeName: "Auction fees - Cattle", FeeAmount: 120 },
  { Id: "114", FeeName: "Auction Fees - sheep/goat", FFAFeeName: "Auction Fees - sheep/goat", FeeAmount: 40 },
  { Id: "115", FeeName: "By seller per day", FFAFeeName: "By seller per day", FeeAmount: 25 },
  { Id: "116", FeeName: "Poultry per day", FFAFeeName: "Poultry per day", FeeAmount: 25 },
  { Id: "117", FeeName: "Handcrafts per day", FFAFeeName: "Handcrafts per day", FeeAmount: 25 },
  { Id: "118", FeeName: "Clothes per vehicle per day", FFAFeeName: "Clothes per vehicle per day", FeeAmount: 30 },
  { Id: "119", FeeName: "Sale fees - Outside Auction yard per Cattle", FFAFeeName: "Sale fees - Outside Auction yard per Cattle", FeeAmount: 200 },
  { Id: "120", FeeName: "Sale fees - Outside Auction yard per sheep/goat", FFAFeeName: "Sale fees - Outside Auction yard per sheep/goat", FeeAmount: 100 },
  { Id: "121", FeeName: "Clothes per vehicle per day", FFAFeeName: "Clothes per vehicle per day", FeeAmount: 100 },
  { Id: "122", FeeName: "Monthly Market Fees", FFAFeeName: "Monthly Market Fees", FeeAmount: 450 },
  { Id: "123", FeeName: "Market Stall Survey Fees", FFAFeeName: "Market Stall Survey Fees", FeeAmount: 500 },
  { Id: "124", FeeName: "Market Stall Allocation Fees", FFAFeeName: "Market Stall Allocation Fees", FeeAmount: 1500 },
  { Id: "125", FeeName: "Market Stall Application Fee", FFAFeeName: "Market Stall Application Fee", FeeAmount: 200 },
  { Id: "126", FeeName: "Auction Fees - Cattle per day", FFAFeeName: "Auction Fees - Cattle per day", FeeAmount: 120 },
  { Id: "127", FeeName: "Auction Fees Outside Auction Yard - Sheep/goat perday", FFAFeeName: "Auction Fees Outside Auction Yard - Sheep/goat perday", FeeAmount: 150 },
  { Id: "128", FeeName: "Fine for not displaying business permit", FFAFeeName: "Fine for not displaying business permit", FeeAmount: 2000 },
  { Id: "129", FeeName: "Impounded Vehicle Storage Charges", FFAFeeName: "Impounded Vehicle Storage Charges", FeeAmount: 500 },
  { Id: "130", FeeName: "Private garbage collectors disposing garbage at non-desgnated areas", FFAFeeName: "Private garbage collectors disposing garbage at non-desgnated areas", FeeAmount: 100000 },
  { Id: "131", FeeName: "Sale of county minutes", FFAFeeName: "Sale of county minutes", FeeAmount: 5 },
  { Id: "132", FeeName: "Sale of County Assembly resolution", FFAFeeName: "Sale of County Assembly resolution", FeeAmount: 5 },
  { Id: "133", FeeName: "Reckless & careless throwing of garbage", FFAFeeName: "Reckless & careless throwing of garbage", FeeAmount: 2000 },
  { Id: "134", FeeName: "Breakage of electric poles by reckless drivers", FFAFeeName: "Breakage of electric poles by reckless drivers", FeeAmount: 60000 },
  { Id: "135", FeeName: "Impounding of non-P.S.V Vehicles", FFAFeeName: "Impounding of non-P.S.V Vehicles", FeeAmount: 3000 },
  { Id: "136", FeeName: "Impounding of defaulting P.S.V Vehicles", FFAFeeName: "Impounding of defaulting P.S.V Vehicles", FeeAmount: 5000 },
  { Id: "137", FeeName: "DeClamping fee - Defaulting Lorries of Cess", FFAFeeName: "DeClamping fee - Defaulting Lorries of Cess", FeeAmount: 7000 },
  { Id: "138", FeeName: "Music Band/ Live Disco Licence", FFAFeeName: "Music Band/ Live Disco Licence", FeeAmount: 3000 },
  { Id: "139", FeeName: "Music Disco/ Live Band- Local", FFAFeeName: "Music Disco/ Live Band- Local", FeeAmount: 1500 },
  { Id: "140", FeeName: "Impounding of tuk tuk", FFAFeeName: "Impounding of tuk tuk", FeeAmount: 1000 },
  { Id: "141", FeeName: "Lorries Up to 5 Tons", FFAFeeName: "Lorries Up to 5 Tons", FeeAmount: 150 },
  { Id: "142", FeeName: "Storage for Impounded Goods", FFAFeeName: "Storage for Impounded Goods", FeeAmount: 200 },
  { Id: "143", FeeName: "Charcoal per big bag", FFAFeeName: "Charcoal per big bag", FeeAmount: 50 },
  { Id: "144", FeeName: "Charcoal per small bag", FFAFeeName: "Charcoal per small bag", FeeAmount: 25 },
  { Id: "145", FeeName: "Sugarcane", FFAFeeName: "Sugarcane", FeeAmount: 1 },
  { Id: "146", FeeName: "Eggs", FFAFeeName: "Eggs", FeeAmount: 30 },
  { Id: "147", FeeName: "Coconuts", FFAFeeName: "Coconuts", FeeAmount: 50 },
  { Id: "148", FeeName: "Simsim", FFAFeeName: "Simsim", FeeAmount: 5 },
  { Id: "149", FeeName: "Livestock on transit cess", FFAFeeName: "Livestock on transit cess", FeeAmount: 50 },
  { Id: "150", FeeName: "Green maize", FFAFeeName: "Green maize", FeeAmount: 50 },
  { Id: "151", FeeName: "Cassava", FFAFeeName: "Cassava", FeeAmount: 2 },
  { Id: "152", FeeName: "Karpok", FFAFeeName: "Karpok", FeeAmount: 10 },
  { Id: "153", FeeName: "Rubber produce", FFAFeeName: "Rubber produce", FeeAmount: 10 },
  { Id: "154", FeeName: "Other Fruits (e.g passion fruits)", FFAFeeName: "Other Fruits (e.g passion fruits)", FeeAmount: 20 },
  { Id: "155", FeeName: "Oranges", FFAFeeName: "Oranges", FeeAmount: 25 },
  { Id: "156", FeeName: "Banana", FFAFeeName: "Banana", FeeAmount: 20 },
  { Id: "157", FeeName: "Garlic", FFAFeeName: "Garlic", FeeAmount: 30 },
  { Id: "158", FeeName: "Banana", FFAFeeName: "Banana", FeeAmount: 10 },
  { Id: "159", FeeName: "Makuti", FFAFeeName: "Makuti", FeeAmount: 5 },
  { Id: "160", FeeName: "Timber/pole/Logs royalty", FFAFeeName: "Timber/pole/Logs royalty", FeeAmount: 600 },
  { Id: "161", FeeName: "Cashewnuts", FFAFeeName: "Cashewnuts", FeeAmount: 3 },
  { Id: "162", FeeName: "Chillies", FFAFeeName: "Chillies", FeeAmount: 3 },
  { Id: "163", FeeName: "Copra", FFAFeeName: "Copra", FeeAmount: 3 },
  { Id: "164", FeeName: "Fish Cess", FFAFeeName: "Fish Cess", FeeAmount: 60 },
  { Id: "165", FeeName: "Madafu", FFAFeeName: "Madafu", FeeAmount: 2 },
  { Id: "166", FeeName: "Water mellon", FFAFeeName: "Water mellon", FeeAmount: 5 },
  { Id: "167", FeeName: "Fresh Spices ( Karafuu, tangawizi, pilipili manga etc)", FFAFeeName: "Fresh Spices ( Karafuu, tangawizi, pilipili manga etc)", FeeAmount: 300 },
  { Id: "168", FeeName: "Dry spices", FFAFeeName: "Dry spices", FeeAmount: 50 },
  { Id: "169", FeeName: "Molases", FFAFeeName: "Molases", FeeAmount: 80 },
  { Id: "170", FeeName: "Timber/pole/Logs royalty", FFAFeeName: "Timber/pole/Logs royalty", FeeAmount: 1700 },
  { Id: "171", FeeName: "Sisal", FFAFeeName: "Sisal", FeeAmount: 250 },
  { Id: "172", FeeName: "Manure", FFAFeeName: "Manure", FeeAmount: 200 },
  { Id: "173", FeeName: "Bixa", FFAFeeName: "Bixa", FeeAmount: 1 },
  { Id: "174", FeeName: "Oranges", FFAFeeName: "Oranges", FeeAmount: 200 },
  { Id: "175", FeeName: "Cassava", FFAFeeName: "Cassava", FeeAmount: 150 },
  { Id: "176", FeeName: "GRASS", FFAFeeName: "GRASS", FeeAmount: 100 },
  { Id: "177", FeeName: "Meat Inspection", FFAFeeName: "Meat Inspection", FeeAmount: 100 },
  { Id: "178", FeeName: "Meat Inspection II", FFAFeeName: "Meat Inspection II", FeeAmount: 2 },
  { Id: "179", FeeName: "Poultry per Bird", FFAFeeName: "Poultry per Bird", FeeAmount: 5 },
  { Id: "180", FeeName: "Certificate of Transport", FFAFeeName: "Certificate of Transport", FeeAmount: 20 },
  { Id: "181", FeeName: "Meat Inspection Fees Goat/Sheep", FFAFeeName: "Meat Inspection Fees Goat/Sheep", FeeAmount: 25 },
  { Id: "182", FeeName: "Scrap per Lorry", FFAFeeName: "Scrap per Lorry", FeeAmount: 10000 },
  { Id: "183", FeeName: "Scrap per Canter", FFAFeeName: "Scrap per Canter", FeeAmount: 5000 },
  { Id: "184", FeeName: "Scrap per Pick-up", FFAFeeName: "Scrap per Pick-up", FeeAmount: 3000 },
  { Id: "185", FeeName: "SCRAP METAL LORRY", FFAFeeName: "SCRAP METAL LORRY", FeeAmount: 10000 },
  { Id: "186", FeeName: "Premise Inspection Fees", FFAFeeName: "Premise Inspection Fees", FeeAmount: 1000 },
  { Id: "187", FeeName: "SCRAP METAL PICKUP", FFAFeeName: "SCRAP METAL PICKUP", FeeAmount: 3000 },
  { Id: "188", FeeName: "Sand/Stone", FFAFeeName: "Sand/Stone", FeeAmount: 100 },
  { Id: "189", FeeName: "Silica Sand 7 tonne lorry", FFAFeeName: "Silica Sand 7 tonne lorry", FeeAmount: 600 },
  { Id: "190", FeeName: "Titanium", FFAFeeName: "Titanium", FeeAmount: 5000 },
  { Id: "191", FeeName: "Murrum/Chips and broken stones", FFAFeeName: "Murrum/Chips and broken stones", FeeAmount: 100 },
  { Id: "192", FeeName: "Top Soil", FFAFeeName: "Top Soil", FeeAmount: 500 },
  { Id: "193", FeeName: "Homa lime produce", FFAFeeName: "Homa lime produce", FeeAmount: 500 },
  { Id: "194", FeeName: "Germ stone/granueles/gold/silver/diamond", FFAFeeName: "Germ stone/granueles/gold/silver/diamond", FeeAmount: 2 },
  { Id: "195", FeeName: "Dumping Fees (Pick - up)", FFAFeeName: "Dumping Fees (Pick - up)", FeeAmount: 500 },
  { Id: "196", FeeName: "Dumping Fees (Canters & Lorries upto 7 tonnes)", FFAFeeName: "Dumping Fees (Canters & Lorries upto 7 tonnes)", FeeAmount: 1000 },
  { Id: "197", FeeName: "Dumping Fees (Lorries above 7 tonnes - 15 tonnes)", FFAFeeName: "Dumping Fees (Lorries above 7 tonnes - 15 tonnes)", FeeAmount: 2000 },
  { Id: "198", FeeName: "Lorries above 15 tonnes (trailers, e.t.c)", FFAFeeName: "Lorries above 15 tonnes (trailers, e.t.c)", FeeAmount: 3000 },
  { Id: "199", FeeName: "Silica Sand 10 tonne Lorry", FFAFeeName: "Silica Sand 10 tonne Lorry", FeeAmount: 900 },
  { Id: "200", FeeName: "Silica Sand 14 Tonne Lorry", FFAFeeName: "Silica Sand 14 Tonne Lorry", FeeAmount: 1200 },
  { Id: "201", FeeName: "Stitching", FFAFeeName: "Stitching", FeeAmount: 200 },
  { Id: "202", FeeName: "Incision and drainage", FFAFeeName: "Incision and drainage", FeeAmount: 50 },
  { Id: "205", FeeName: "Removal of stitches", FFAFeeName: "Removal of stitches", FeeAmount: 30 },
  { Id: "206", FeeName: "Ordinary drugs", FFAFeeName: "Ordinary drugs", FeeAmount: 30 },
  { Id: "208", FeeName: "OPD booklets", FFAFeeName: "OPD booklets", FeeAmount: 20 },
  { Id: "211", FeeName: "P3 filling", FFAFeeName: "P3 filling", FeeAmount: 200 },
  { Id: "212", FeeName: "Medical examination", FFAFeeName: "Medical examination", FeeAmount: 200 },
  { Id: "215", FeeName: "Ordinary drugs", FFAFeeName: "Ordinary drugs", FeeAmount: 30 },
  { Id: "216", FeeName: "Anti – hypertension", FFAFeeName: "Anti – hypertension", FeeAmount: 50 },
  { Id: "217", FeeName: "Anti – diabetics", FFAFeeName: "Anti – diabetics", FeeAmount: 50 },
  { Id: "220", FeeName: "Giving set", FFAFeeName: "Giving set", FeeAmount: 50 },
  { Id: "224", FeeName: "Hb", FFAFeeName: "Hb", FeeAmount: 50 },
  { Id: "225", FeeName: "Pregnant test", FFAFeeName: "Pregnant test", FeeAmount: 150 },
  { Id: "226", FeeName: "Stool for o/c", FFAFeeName: "Stool for o/c", FeeAmount: 50 },
  { Id: "227", FeeName: "Urinalysis", FFAFeeName: "Urinalysis", FeeAmount: 50 },
  { Id: "228", FeeName: "Grouping and x – matching", FFAFeeName: "Grouping and x – matching", FeeAmount: 200 },
  { Id: "229", FeeName: "Full Hemogram", FFAFeeName: "Full Hemogram", FeeAmount: 0 },
  { Id: "230", FeeName: "Culture and sensitivity", FFAFeeName: "Culture and sensitivity", FeeAmount: 200 },
  { Id: "231", FeeName: "Any special test", FFAFeeName: "Any special test", FeeAmount: 200 },
  { Id: "232", FeeName: "Specimen for referral", FFAFeeName: "Specimen for referral", FeeAmount: 250 },
  { Id: "233", FeeName: "VDRL", FFAFeeName: "VDRL", FeeAmount: 80 },
  { Id: "234", FeeName: "Blood sugar", FFAFeeName: "Blood sugar", FeeAmount: 50 },
  { Id: "235", FeeName: "Antibiotics Injection", FFAFeeName: "Antibiotics Injection", FeeAmount: 0 },
  { Id: "236", FeeName: "Amalgam Filling", FFAFeeName: "Amalgam Filling", FeeAmount: 0 },
  { Id: "237", FeeName: "Out-Patient Gate fee", FFAFeeName: "Out-Patient Gate fee", FeeAmount: 100 },
  { Id: "242", FeeName: "Circumcision under GA", FFAFeeName: "Circumcision under GA", FeeAmount: 1500 },
  { Id: "243", FeeName: "Circumcision", FFAFeeName: "Circumcision", FeeAmount: 0 },
  { Id: "244", FeeName: "Physio session", FFAFeeName: "Physio session", FeeAmount: 150 },
  { Id: "256", FeeName: "Medical Form", FFAFeeName: "Medical Form", FeeAmount: 1 },
  { Id: "257", FeeName: "Syringe/ Needles", FFAFeeName: "Syringe/ Needles", FeeAmount: 0 },
  { Id: "258", FeeName: "Saloon Car", FFAFeeName: "Saloon Car", FeeAmount: 50 },
  { Id: "259", FeeName: "Matatu - Monthly", FFAFeeName: "Matatu - Monthly", FeeAmount: 2000 },
  { Id: "260", FeeName: "Mini-Bus - Monthly", FFAFeeName: "Mini-Bus - Monthly", FeeAmount: 3200 },
  { Id: "261", FeeName: "Buses", FFAFeeName: "Buses", FeeAmount: 250 },
  { Id: "262", FeeName: "Pick - up upto 1 tonne", FFAFeeName: "Pick - up upto 1 tonne", FeeAmount: 60 },
  { Id: "263", FeeName: "Canter", FFAFeeName: "Canter", FeeAmount: 100 },
  { Id: "264", FeeName: "Matatu - Quarterly", FFAFeeName: "Matatu - Quarterly", FeeAmount: 6000 },
  { Id: "265", FeeName: "Mini-Bus - Quarterly", FFAFeeName: "Mini-Bus - Quarterly", FeeAmount: 7200 },
  { Id: "266", FeeName: "Bus - Quarterly", FFAFeeName: "Bus - Quarterly", FeeAmount: 14000 },
  { Id: "267", FeeName: "Bus - Bi-annual", FFAFeeName: "Bus - Bi-annual", FeeAmount: 25000 },
  { Id: "268", FeeName: "Mini-Bus - Bi-annual", FFAFeeName: "Mini-Bus - Bi-annual", FeeAmount: 12000 },
  { Id: "269", FeeName: "Matatu - Bi-annual", FFAFeeName: "Matatu - Bi-annual", FeeAmount: 10000 },
  { Id: "270", FeeName: "Bus - Monthly", FFAFeeName: "Bus - Monthly", FeeAmount: 5000 },
  { Id: "271", FeeName: "Mini-Bus - Annual", FFAFeeName: "Mini-Bus - Annual", FeeAmount: 20000 },
  { Id: "272", FeeName: "Bus - Annual", FFAFeeName: "Bus - Annual", FeeAmount: 40000 },
  { Id: "273", FeeName: "Matatu - Annual", FFAFeeName: "Matatu - Annual", FeeAmount: 18000 },
  { Id: "274", FeeName: "Trailers Border Parking Fees", FFAFeeName: "Trailers Border Parking Fees", FeeAmount: 1000 },
  { Id: "275", FeeName: "Stall Rent Arrears", FFAFeeName: "Stall Rent Arrears", FeeAmount: 0 },
  { Id: "276", FeeName: "Saloon Car Monthly Parking", FFAFeeName: "Saloon Car Monthly Parking", FeeAmount: 1200 },
  { Id: "277", FeeName: "RESERVED PARKING (MULTIPLE)", FFAFeeName: "RESERVED PARKING (MULTIPLE)", FeeAmount: 2000 },
  { Id: "278", FeeName: "Vehicle Entry Per DAy", FFAFeeName: "Vehicle Entry Per DAy", FeeAmount: 500 },
  { Id: "279", FeeName: "Reserved Parking (Canter)", FFAFeeName: "Reserved Parking (Canter)", FeeAmount: 2200 },
  { Id: "280", FeeName: "Large Cold Storage Facility", FFAFeeName: "Large Cold Storage Facility", FeeAmount: 82400 },
  { Id: "281", FeeName: "Restaurant/Eating House/Hotel Certificate", FFAFeeName: "Restaurant/Eating House/Hotel Certificate", FeeAmount: 2300 },
  { Id: "282", FeeName: "COUNTER SCALE MACHINE(CSM)", FFAFeeName: "COUNTER SCALE MACHINE(CSM)", FeeAmount: 400 },
  { Id: "283", FeeName: "Refuse Collection Fees - Beach hotel upto 250 beds", FFAFeeName: "Refuse Collection Fees - Beach hotel upto 250 beds", FeeAmount: 20000 },
  { Id: "284", FeeName: "Lodging Rooms for Accommodation/Cottages Certificate", FFAFeeName: "Lodging Rooms for Accommodation/Cottages Certificate", FeeAmount: 2500 },
  { Id: "285", FeeName: "Wholesalers", FFAFeeName: "Wholesalers", FeeAmount: 2500 },
  { Id: "286", FeeName: "Platform Electronic (PE)", FFAFeeName: "Platform Electronic (PE)", FeeAmount: 2000 },
  { Id: "287", FeeName: "Bar/Canteen/Bakery/Beer Depot/Butchery Certificate", FFAFeeName: "Bar/Canteen/Bakery/Beer Depot/Butchery Certificate", FeeAmount: 2300 },
  { Id: "288", FeeName: "Soda Depot/Container/ Retail Shops Certificate", FFAFeeName: "Soda Depot/Container/ Retail Shops Certificate", FeeAmount: 2100 },
  { Id: "289", FeeName: "Sanitary Inspection of Schools & other Institutions for Registration", FFAFeeName: "Sanitary Inspection of Schools & other Institutions for Registration", FeeAmount: 3000 },
  { Id: "290", FeeName: "Spring Balance (SB)", FFAFeeName: "Spring Balance (SB)", FeeAmount: 1000 },
  { Id: "291", FeeName: "Illuminated Neon SIgn Application Fees", FFAFeeName: "Illuminated Neon SIgn Application Fees", FeeAmount: 1600 },
  { Id: "292", FeeName: "Advert on canvas charge per sq meter per year", FFAFeeName: "Advert on canvas charge per sq meter per year", FeeAmount: 800 },
  { Id: "293", FeeName: "Counter Scale Electronic (CSE)", FFAFeeName: "Counter Scale Electronic (CSE)", FeeAmount: 1200 },
  { Id: "294", FeeName: "Dial Self Indicating (DSI)", FFAFeeName: "Dial Self Indicating (DSI)", FeeAmount: 1000 },
  { Id: "295", FeeName: "Refuse Collection Fees - Hotels over 250 beds", FFAFeeName: "Refuse Collection Fees - Hotels over 250 beds", FeeAmount: 30000 },
  { Id: "296", FeeName: "Bus stop adverts application fee", FFAFeeName: "Bus stop adverts application fee", FeeAmount: 2000 },
  { Id: "297", FeeName: "Signboard (1-2M SQ  - double sided) on public land", FFAFeeName: "Signboard (1-2M SQ  - double sided) on public land", FeeAmount: 22000 },
  { Id: "298", FeeName: "Supermarket/ Food Warehouse Certificate", FFAFeeName: "Supermarket/ Food Warehouse Certificate", FeeAmount: 2500 },
  { Id: "299", FeeName: "Signboard (2-5M SQ - one sided) on public land", FFAFeeName: "Signboard (2-5M SQ - one sided) on public land", FeeAmount: 30000 },
  { Id: "300", FeeName: "Food Handling", FFAFeeName: "Food Handling", FeeAmount: 2100 },
  { Id: "301", FeeName: "Non-illuminated Neon Signs Application Fees", FFAFeeName: "Non-illuminated Neon Signs Application Fees", FeeAmount: 800 },
  { Id: "302", FeeName: "Filling station advertisement/ price board", FFAFeeName: "Filling station advertisement/ price board", FeeAmount: 70000 },
  { Id: "303", FeeName: "Adverts application fees", FFAFeeName: "Adverts application fees", FeeAmount: 2000 },
  { Id: "304", FeeName: "Dairy Milk Bar", FFAFeeName: "Dairy Milk Bar", FeeAmount: 2200 },
  { Id: "305", FeeName: "Food Factory", FFAFeeName: "Food Factory", FeeAmount: 2300 },
  { Id: "306", FeeName: "Stamping Fees - Dispensing Pumps", FFAFeeName: "Stamping Fees - Dispensing Pumps", FeeAmount: 1600 },
  { Id: "307", FeeName: "Traditional Beer Premises Health Certificate", FFAFeeName: "Traditional Beer Premises Health Certificate", FeeAmount: 3300 },
  { Id: "308", FeeName: "Business Permits Late Payment Penalties, Current Year", FFAFeeName: "Business Permits Late Payment Penalties, Current Year", FeeAmount: 1 },
  { Id: "309", FeeName: "Wall painting on temporary premises annual fee", FFAFeeName: "Wall painting on temporary premises annual fee", FeeAmount: 3000 },
  { Id: "310", FeeName: "External decoration application fee", FFAFeeName: "External decoration application fee", FeeAmount: 2000 },
  { Id: "311", FeeName: "DEMO FEE", FFAFeeName: "DEMO FEE", FeeAmount: 0 },
  { Id: "312", FeeName: "Business Penalty", FFAFeeName: "Business Penalty", FeeAmount: 3434 },
  { Id: "313", FeeName: "Anti – diabetics", FFAFeeName: "Anti – diabetics", FeeAmount: 50 },
  { Id: "314", FeeName: "Blood sugar", FFAFeeName: "Blood sugar", FeeAmount: 50 },
  { Id: "315", FeeName: "house1", FFAFeeName: "house1", FeeAmount: 1000 },
  { Id: "316", FeeName: "stall1", FFAFeeName: "stall1", FeeAmount: 500 },
  { Id: "317", FeeName: "Penalty For May", FFAFeeName: "Penalty For May", FeeAmount: 3434 },
  { Id: "318", FeeName: "Penalty For June", FFAFeeName: "Penalty For June", FeeAmount: 3434 },
  { Id: "319", FeeName: "Penalty For July", FFAFeeName: "Penalty For July", FeeAmount: 3434 },
  { Id: "320", FeeName: "Penalty For August", FFAFeeName: "Penalty For August", FeeAmount: 3434 },
  { Id: "321", FeeName: "Penalty For September", FFAFeeName: "Penalty For September", FeeAmount: 3434 },
  { Id: "322", FeeName: "Penalty For October", FFAFeeName: "Penalty For October", FeeAmount: 3434 },
  { Id: "323", FeeName: "Penalty For November", FFAFeeName: "Penalty For November", FeeAmount: 3434 },
  { Id: "324", FeeName: "Penalty For December", FFAFeeName: "Penalty For December", FeeAmount: 3434 },
  { Id: "376", FeeName: "General Drugs", FFAFeeName: "General Drugs", FeeAmount: 10 },
  { Id: "377", FeeName: "Special Drugs", FFAFeeName: "Special Drugs", FeeAmount: 10 },
  { Id: "400", FeeName: "Transit Fees (Tea Leaves)", FFAFeeName: "Transit Fees (Tea Leaves)", FeeAmount: 3000 },
  { Id: "401", FeeName: "Transit Fees (Other Products)", FFAFeeName: "Transit Fees (Other Products)", FeeAmount: 2500 },
  { Id: "402", FeeName: "Single Storey Residential House", FFAFeeName: "Single Storey Residential House", FeeAmount: 1000 },
  { Id: "403", FeeName: "Multi Storey Residential House", FFAFeeName: "Multi Storey Residential House", FeeAmount: 2000 },
  { Id: "404", FeeName: "Commercial Single Storey House", FFAFeeName: "Commercial Single Storey House", FeeAmount: 3000 },
  { Id: "405", FeeName: "Commercial Multi Storey House", FFAFeeName: "Commercial Multi Storey House", FeeAmount: 5000 },
  { Id: "406", FeeName: "Building Occupation Inspection Fees", FFAFeeName: "Building Occupation Inspection Fees", FeeAmount: 1000 },
  { Id: "407", FeeName: "Commercial Vehicle Entry", FFAFeeName: "Commercial Vehicle Entry", FeeAmount: 1800 },
  { Id: "408", FeeName: "Sign Board Advert (1 to 2 Sq. Metres)", FFAFeeName: "Sign Board Advert (1 to 2 Sq. Metres)", FeeAmount: 10000 },
  { Id: "409", FeeName: "Pickups", FFAFeeName: "Pickups", FeeAmount: 500 },
  { Id: "410", FeeName: "Canters & Lorries Up to 7 Tons", FFAFeeName: "Canters & Lorries Up to 7 Tons", FeeAmount: 1000 },
  { Id: "411", FeeName: "Advertisement on Banners per day", FFAFeeName: "Advertisement on Banners per day", FeeAmount: 400 },
  { Id: "412", FeeName: "Advertisement on Banners per Fortnight", FFAFeeName: "Advertisement on Banners per Fortnight", FeeAmount: 5000 },
  { Id: "481", FeeName: "Slaughtering Fee - Cattle", FFAFeeName: "Slaughtering Fee - Cattle", FeeAmount: 80 },
  { Id: "482", FeeName: "Slaughtering Fee - Sheep/ Goat", FFAFeeName: "Slaughtering Fee - Sheep/ Goat", FeeAmount: 40 },
  { Id: "483", FeeName: "Hides", FFAFeeName: "Hides", FeeAmount: 15 },
  { Id: "484", FeeName: "Skin", FFAFeeName: "Skin", FeeAmount: 10 },
  { Id: "485", FeeName: "Physiotherapy Fees", FFAFeeName: "Physiotherapy Fees", FeeAmount: 50 },
  { Id: "486", FeeName: "House Rent Arrears", FFAFeeName: "House Rent Arrears", FeeAmount: 0 },
  { Id: "487", FeeName: "White House Rent", FFAFeeName: "White House Rent", FeeAmount: 6000 },
  { Id: "488", FeeName: "Tuk Tuk - Monthly", FFAFeeName: "Tuk Tuk - Monthly", FeeAmount: 350 },
  { Id: "489", FeeName: "Counter Scale Machine", FFAFeeName: "Counter Scale Machine", FeeAmount: 400 },
  { Id: "490", FeeName: "Linda Mama", FFAFeeName: "Linda Mama", FeeAmount: 1 },
  { Id: "491", FeeName: "Capitation", FFAFeeName: "Capitation", FeeAmount: 1 },
  { Id: "492", FeeName: "Medicals", FFAFeeName: "Medicals", FeeAmount: 1 },
  { Id: "500", FeeName: "Application for Development Fee", FFAFeeName: "Application for Development Fee", FeeAmount: 2000 },
  { Id: "501", FeeName: "Building plan Approval per sq. Metre", FFAFeeName: "Building plan Approval per sq. Metre", FeeAmount: 35 },
  { Id: "502", FeeName: "Physical Planning Assessment Fee", FFAFeeName: "Physical Planning Assessment Fee", FeeAmount: 3000 },
  { Id: "503", FeeName: "Plot Transfer Fee", FFAFeeName: "Plot Transfer Fee", FeeAmount: 5000 },
  { Id: "504", FeeName: "Plaster service", FFAFeeName: "Plaster service", FeeAmount: 1 },
  { Id: "505", FeeName: "MCH/FP service", FFAFeeName: "MCH/FP service", FeeAmount: 1 },
  { Id: "506", FeeName: "RECORDS SERVICES", FFAFeeName: "RECORDS SERVICES", FeeAmount: 1 },
  { Id: "507", FeeName: "Male ward services", FFAFeeName: "Male ward services", FeeAmount: 1 },
  { Id: "508", FeeName: "Female Ward Services", FFAFeeName: "Female Ward Services", FeeAmount: 1 },
  { Id: "509", FeeName: "Maternity Services", FFAFeeName: "Maternity Services", FeeAmount: 1 },
  { Id: "510", FeeName: "Paediatric Ward Service", FFAFeeName: "Paediatric Ward Service", FeeAmount: 1 },
  { Id: "511", FeeName: "Lab charges", FFAFeeName: "Lab charges", FeeAmount: 1 },
  { Id: "512", FeeName: "Occupational Therapy charge", FFAFeeName: "Occupational Therapy charge", FeeAmount: 1 },
  { Id: "513", FeeName: "Drugs", FFAFeeName: "Drugs", FeeAmount: 1 },
  { Id: "514", FeeName: "Physiotherapy service", FFAFeeName: "Physiotherapy service", FeeAmount: 1 },
  { Id: "515", FeeName: "Orthopaedic charge", FFAFeeName: "Orthopaedic charge", FeeAmount: 1 },
  { Id: "516", FeeName: "Clearance Certificate", FFAFeeName: "Clearance Certificate", FeeAmount: 2500 },
  { Id: "517", FeeName: "Outpatient Service Charge", FFAFeeName: "Outpatient Service Charge", FeeAmount: 1 },
  { Id: "518", FeeName: "Radiological service", FFAFeeName: "Radiological service", FeeAmount: 1 },
  { Id: "519", FeeName: "Theatre Service Fees", FFAFeeName: "Theatre Service Fees", FeeAmount: 1 },
  { Id: "520", FeeName: "Admission fees", FFAFeeName: "Admission fees", FeeAmount: 2000 },
  { Id: "521", FeeName: "B.I.D", FFAFeeName: "B.I.D", FeeAmount: 2000 },
  { Id: "522", FeeName: "Daily Body Charge", FFAFeeName: "Daily Body Charge", FeeAmount: 500 },
  { Id: "523", FeeName: "Post Mortem-K", FFAFeeName: "Post Mortem-K", FeeAmount: 2000 },
  { Id: "524", FeeName: "Post Mortem-P", FFAFeeName: "Post Mortem-P", FeeAmount: 3000 },
  { Id: "525", FeeName: "Refregeration", FFAFeeName: "Refregeration", FeeAmount: 1000 },
  { Id: "526", FeeName: "Superficial embalmment-K", FFAFeeName: "Superficial embalmment-K", FeeAmount: 1000 },
  { Id: "527", FeeName: "Superficial embalmment-P", FFAFeeName: "Superficial embalmment-P", FeeAmount: 2000 },
  { Id: "528", FeeName: "Long leg cast", FFAFeeName: "Long leg cast", FeeAmount: 300 },
  { Id: "529", FeeName: "Hip spica cast", FFAFeeName: "Hip spica cast", FeeAmount: 300 },
  { Id: "530", FeeName: "Skeletal traction application", FFAFeeName: "Skeletal traction application", FeeAmount: 1000 },
  { Id: "531", FeeName: "Skin traction application", FFAFeeName: "Skin traction application", FeeAmount: 1000 },
  { Id: "532", FeeName: "Dislocations reduction", FFAFeeName: "Dislocations reduction", FeeAmount: 1000 },
  { Id: "533", FeeName: "Cast removals", FFAFeeName: "Cast removals", FeeAmount: 300 },
  { Id: "534", FeeName: "Diprofose injection", FFAFeeName: "Diprofose injection", FeeAmount: 300 },
  { Id: "535", FeeName: "Dina cast application", FFAFeeName: "Dina cast application", FeeAmount: 1000 },
  { Id: "536", FeeName: "Exofix removal", FFAFeeName: "Exofix removal", FeeAmount: 1500 },
  { Id: "537", FeeName: "K-wire removal", FFAFeeName: "K-wire removal", FeeAmount: 1500 },
  { Id: "538", FeeName: "Dicast removal", FFAFeeName: "Dicast removal", FeeAmount: 500 },
  { Id: "539", FeeName: "Dialysis", FFAFeeName: "Dialysis", FeeAmount: 6000 },
  { Id: "540", FeeName: "Medical forms (GP69)", FFAFeeName: "Medical forms (GP69)", FeeAmount: 500 },
  { Id: "541", FeeName: "Compesation Forms", FFAFeeName: "Compesation Forms", FeeAmount: 500 },
  { Id: "542", FeeName: "Filling of P3 assault", FFAFeeName: "Filling of P3 assault", FeeAmount: 1000 },
  { Id: "543", FeeName: "Spinal Brace", FFAFeeName: "Spinal Brace", FeeAmount: 5000 },
  { Id: "544", FeeName: "Orhtosis", FFAFeeName: "Orhtosis", FeeAmount: 5000 },
  { Id: "545", FeeName: "A/K Prosthesis", FFAFeeName: "A/K Prosthesis", FeeAmount: 5000 },
  { Id: "546", FeeName: "Upper limb prosthesis", FFAFeeName: "Upper limb prosthesis", FeeAmount: 7500 },
  { Id: "547", FeeName: "Dennis Brown Splint", FFAFeeName: "Dennis Brown Splint", FeeAmount: 400 },
  { Id: "548", FeeName: "Prosthetic and Orthotic repairs", FFAFeeName: "Prosthetic and Orthotic repairs", FeeAmount: 400 },
  { Id: "549", FeeName: "Surgical footwear", FFAFeeName: "Surgical footwear", FeeAmount: 400 },
  { Id: "550", FeeName: "MCR Sandals", FFAFeeName: "MCR Sandals", FeeAmount: 300 },
  { Id: "551", FeeName: "Crutches", FFAFeeName: "Crutches", FeeAmount: 2000 },
  { Id: "552", FeeName: "Backslabs", FFAFeeName: "Backslabs", FeeAmount: 500 },
  { Id: "553", FeeName: "Knee Orthosis", FFAFeeName: "Knee Orthosis", FeeAmount: 1500 },
  { Id: "554", FeeName: "Below knee orthosis", FFAFeeName: "Below knee orthosis", FeeAmount: 500 },
  { Id: "555", FeeName: "Cervical color", FFAFeeName: "Cervical color", FeeAmount: 1000 },
  { Id: "556", FeeName: "Imported SACH foot", FFAFeeName: "Imported SACH foot", FeeAmount: 7500 },
  { Id: "557", FeeName: "Spinal corset", FFAFeeName: "Spinal corset", FeeAmount: 3500 },
  { Id: "558", FeeName: "A/B Orthosis", FFAFeeName: "A/B Orthosis", FeeAmount: 1500 },
  { Id: "559", FeeName: "Way-Leave Fees", FFAFeeName: "Way-Leave Fees", FeeAmount: 100 },
  { Id: "560", FeeName: "Way-Leave Application Fees", FFAFeeName: "Way-Leave Application Fees", FeeAmount: 7000 },
  { Id: "561", FeeName: "Stamping Fees -Platform Digital  (300Kg)", FFAFeeName: "Stamping Fees -Platform Digital  (300Kg)", FeeAmount: 2000 },
  { Id: "562", FeeName: "Stamping Fee -Counter Electronic  Scale", FFAFeeName: "Stamping Fee -Counter Electronic  Scale", FeeAmount: 1200 },
  { Id: "563", FeeName: "Stamping Fees -Platform Mechanical (250Kg)", FFAFeeName: "Stamping Fees -Platform Mechanical (250Kg)", FeeAmount: 1000 },
  { Id: "564", FeeName: "Stamping Fees -Spring Balance Salter", FFAFeeName: "Stamping Fees -Spring Balance Salter", FeeAmount: 1000 },
  { Id: "565", FeeName: "Stamping Fees -Crane Scale Electronic", FFAFeeName: "Stamping Fees -Crane Scale Electronic", FeeAmount: 1000 },
  { Id: "1561", FeeName: "Large Agricultural Producer/Processor/Dealer/Exporter", FFAFeeName: "Large Agricultural Producer/Processor/Dealer/Exporter", FeeAmount: 90800 },
  { Id: "1562", FeeName: "Medium Agricultural Producer/Processor/Dealer/Exporter", FFAFeeName: "Medium Agricultural Producer/Processor/Dealer/Exporter", FeeAmount: 37200 },
  { Id: "1563", FeeName: "Small Agricultural Producer/Processor/Dealer", FFAFeeName: "Small Agricultural Producer/Processor/Dealer", FeeAmount: 3200 },
  { Id: "1564", FeeName: "Large Mining or Natural Resources Extraction Operation", FFAFeeName: "Large Mining or Natural Resources Extraction Operation", FeeAmount: 1000000 },
  { Id: "1565", FeeName: "Medium Mining or Natural Resources Extraction Operation", FFAFeeName: "Medium Mining or Natural Resources Extraction Operation", FeeAmount: 67200 },
  { Id: "1566", FeeName: "Small Mining or Natural Resources Extraction Operation", FFAFeeName: "Small Mining or Natural Resources Extraction Operation", FeeAmount: 37200 },
  { Id: "1567", FeeName: "Medium Industrial Plant: From 16 to 75 employees or premises from 100 m2 to 2,500 m2.", FFAFeeName: "Medium Industrial Plant: From 16 to 75 employees or premises from 100 m2 to 2,500 m2.", FeeAmount: 130000 },
  { Id: "1568", FeeName: "Large Private Health Facility: Hospital, Clinic, Nursing Home (providing overnight accommodation with capacity over 30 beds), Funeral Home.", FFAFeeName: "Large Private Health Facility: Hospital, Clinic, Nursing Home (providing overnight accommodation with capacity over 30 beds), Funeral Home.", FeeAmount: 25000 },

  { Id: "2562", FeeName: "Advert Fees - Anual", FFAFeeName: "Advert Fees - Anual", FeeAmount: 1000 },
  { Id: "2563", FeeName: "Open Air Exhibition", FFAFeeName: "Open Air Exhibition", FeeAmount: 2000 },
  { Id: "2564", FeeName: "Market Stall Rent - Kwale", FFAFeeName: "Market Stall Rent - Kwale", FeeAmount: 1200 },
  { Id: "2565", FeeName: "Billboard (6 -8m Sq)", FFAFeeName: "Billboard (6 -8m Sq)", FeeAmount: 50000 },
  { Id: "2566", FeeName: "Billboard (9m Sq)", FFAFeeName: "Billboard (9m Sq)", FeeAmount: 70000 },
  { Id: "2567", FeeName: "Filling Station Advertisement", FFAFeeName: "Filling Station Advertisement", FeeAmount: 70000 },
  { Id: "2568", FeeName: "Public Health for Schools", FFAFeeName: "Public Health for Schools", FeeAmount: 3000 },
  { Id: "2569", FeeName: "Private Higher Education Institution", FFAFeeName: "Private Higher Education Institution", FeeAmount: 18000 },
  { Id: "2570", FeeName: "Large Private Education Institution", FFAFeeName: "Large Private Education Institution", FeeAmount: 12000 },
  { Id: "2571", FeeName: "Medium Private Education Institution", FFAFeeName: "Medium Private Education Institution", FeeAmount: 6000 },
  { Id: "2572", FeeName: "Small Private Education Facility", FFAFeeName: "Small Private Education Facility", FeeAmount: 4000 },
  { Id: "2573", FeeName: "Traditional Health Services, Herbalist, Traditional Healer, etc", FFAFeeName: "Traditional Health Services, Herbalist, Traditional Healer, etc", FeeAmount: 3200 },
  { Id: "2574", FeeName: "Large Entertainment Facility", FFAFeeName: "Large Entertainment Facility", FeeAmount: 67200 },
  { Id: "2575", FeeName: "Medium Entertainment Facility", FFAFeeName: "Medium Entertainment Facility", FeeAmount: 37200 },
  { Id: "2576", FeeName: "Large Communications Co.", FFAFeeName: "Large Communications Co.", FeeAmount: 134800 },
  { Id: "2577", FeeName: "Shimbahills Ground Rent", FFAFeeName: "Shimbahills Ground Rent", FeeAmount: 600 },
  { Id: "2578", FeeName: "Subdivision Compliance Certificate", FFAFeeName: "Subdivision Compliance Certificate", FeeAmount: 500 },
  { Id: "2579", FeeName: "Wall Branding Fee", FFAFeeName: "Wall Branding Fee", FeeAmount: 8000 },
  { Id: "2580", FeeName: "Sandwich-man", FFAFeeName: "Sandwich-man", FeeAmount: 2500 },
  { Id: "2581", FeeName: "Neon Signs", FFAFeeName: "Neon Signs", FeeAmount: 1 },
  { Id: "2582", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 52000 },
  { Id: "2583", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 52000 },
  { Id: "2584", FeeName: "Ground Rent Kanana", FFAFeeName: "Ground Rent Kanana", FeeAmount: 1500 },
  { Id: "2585", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 600 },
  { Id: "2586", FeeName: "Liquor Licence Application Fees", FFAFeeName: "Liquor Licence Application Fees", FeeAmount: 500 },
  { Id: "3586", FeeName: "Annual Rent", FFAFeeName: "Annual Rent", FeeAmount: 1500 },
  { Id: "3587", FeeName: "Pungu Slaughterhouse Rent", FFAFeeName: "Pungu Slaughterhouse Rent", FeeAmount: 80000 },
  { Id: "3588", FeeName: "Commissions Received", FFAFeeName: "Commissions Received", FeeAmount: 1 },
  { Id: "3589", FeeName: "PUBLIC HEALTH SERVICES FEE", FFAFeeName: "PUBLIC HEALTH SERVICES FEE", FeeAmount: 1000 },
  { Id: "3590", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1000 },
  { Id: "3591", FeeName: "Four Face Clock Advertisement", FFAFeeName: "Four Face Clock Advertisement", FeeAmount: 55000 },
  { Id: "3592", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 5960 },
  { Id: "3593", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1140 },
  { Id: "3594", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 7440 },
  { Id: "3595", FeeName: "Other Professional & Technical Services", FFAFeeName: "Other Professional & Technical Services", FeeAmount: 2800 },
  { Id: "3596", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 6160 },
  { Id: "3597", FeeName: "General retail alcoholic drink licence (Premises situate within City/ Municipality)", FFAFeeName: "General retail alcoholic drink licence (Premises situate within City/ Municipality)", FeeAmount: 50000 },
  { Id: "3598", FeeName: "Ground Rent Kinango", FFAFeeName: "Ground Rent Kinango", FeeAmount: 500 },
  { Id: "3599", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1200 },
  { Id: "3600", FeeName: "Occasional Advertisement per Day", FFAFeeName: "Occasional Advertisement per Day", FeeAmount: 5000 },
  { Id: "3601", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 4440 },
  { Id: "3602", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 900 },
  { Id: "3603", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1680 },
  { Id: "3604", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 3680 },
  { Id: "3605", FeeName: "Structural Approval Fees", FFAFeeName: "Structural Approval Fees", FeeAmount: 15 },
  { Id: "3606", FeeName: "Septic Tank and Soak Pit", FFAFeeName: "Septic Tank and Soak Pit", FeeAmount: 3000 },
  { Id: "3607", FeeName: "General retail alcoholic drink licence (Premises situate within Urban areas other than City/ Municipality)", FFAFeeName: "General retail alcoholic drink licence (Premises situate within Urban areas other than City/ Municipality)", FeeAmount: 30000 },
  { Id: "3608", FeeName: "General retail alcoholic drink licence (Premises situate elsewhere than in a City/ Municipality/Urban areas)", FFAFeeName: "General retail alcoholic drink licence (Premises situate elsewhere than in a City/ Municipality/Urban areas)", FeeAmount: 15000 },
  { Id: "3609", FeeName: "General retail alcoholic drink Off licence (Premises situate within City/ Municipality)", FFAFeeName: "General retail alcoholic drink Off licence (Premises situate within City/ Municipality)", FeeAmount: 24000 },
  { Id: "3610", FeeName: "General retail alcoholic drink Off licence (Premises situate within Urban areas other than City/ Municipality)", FFAFeeName: "General retail alcoholic drink Off licence (Premises situate within Urban areas other than City/ Municipality)", FeeAmount: 18000 },
  { Id: "3611", FeeName: "General retail alcoholic drink Off licence (Premises situate elsewhere than in a City/Municipality/Urban areas)", FFAFeeName: "General retail alcoholic drink Off licence (Premises situate elsewhere than in a City/Municipality/Urban areas)", FeeAmount: 12000 },
  { Id: "3612", FeeName: "Wholesale alcoholic drink licence per premise", FFAFeeName: "Wholesale alcoholic drink licence per premise", FeeAmount: 50000 },
  { Id: "3613", FeeName: "Hotel alcoholic drink licence (premises situate within a City or a municipality)", FFAFeeName: "Hotel alcoholic drink licence (premises situate within a City or a municipality)", FeeAmount: 50000 },
  { Id: "3614", FeeName: "Hotel alcoholic drink licence (premises situate within urban areas other than a City/ municipality)", FFAFeeName: "Hotel alcoholic drink licence (premises situate within urban areas other than a City/ municipality)", FeeAmount: 30000 },
  { Id: "3615", FeeName: "Telecommunication Masts Ground Rent", FFAFeeName: "Telecommunication Masts Ground Rent", FeeAmount: 1 },
  { Id: "3616", FeeName: "Burial Fees-Adult", FFAFeeName: "Burial Fees-Adult", FeeAmount: 1000 },
  { Id: "3617", FeeName: "Burial Fees-Child", FFAFeeName: "Burial Fees-Child", FeeAmount: 500 },
  { Id: "3618", FeeName: "Plot Application Fee", FFAFeeName: "Plot Application Fee", FeeAmount: 1000 },
  { Id: "3619", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 10000 },
  { Id: "3620", FeeName: "Asset Lease Arrears", FFAFeeName: "Asset Lease Arrears", FeeAmount: 0 },
  { Id: "3621", FeeName: "Form PPA1", FFAFeeName: "Form PPA1", FeeAmount: 2000 },
  { Id: "4621", FeeName: "Consolidation Certificate", FFAFeeName: "Consolidation Certificate", FeeAmount: 1000 },
  { Id: "4622", FeeName: "Ground Rent Kinango 2", FFAFeeName: "Ground Rent Kinango 2", FeeAmount: 1500 },
  { Id: "4623", FeeName: "Extension of User-Other Areas", FFAFeeName: "Extension of User-Other Areas", FeeAmount: 60000 },
  { Id: "4624", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1760 },
  { Id: "5624", FeeName: "Commercial Filming/ Photo Shooting", FFAFeeName: "Commercial Filming/ Photo Shooting", FeeAmount: 200000 },
  { Id: "6624", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1500 },
  { Id: "6625", FeeName: "Matatu-Monthly", FFAFeeName: "Matatu-Monthly", FeeAmount: 2000 },
  { Id: "7625", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 1600 },
  { Id: "7626", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 2360 },
  { Id: "8625", FeeName: "Hoarding of construction site", FFAFeeName: "Hoarding of construction site", FeeAmount: 500 },
  { Id: "9625", FeeName: "Street Light Pole Advertisement", FFAFeeName: "Street Light Pole Advertisement", FeeAmount: 5000 },
  { Id: "10625", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 2660 },
  { Id: "10626", FeeName: "Godoni Ground Rent", FFAFeeName: "Godoni Ground Rent", FeeAmount: 2040 },
  { Id: "10627", FeeName: "Hire of Social Hall", FFAFeeName: "Hire of Social Hall", FeeAmount: 2500 },
  { Id: "10628", FeeName: "Motorcycle Monthly Parking Fees", FFAFeeName: "Motorcycle Monthly Parking Fees", FeeAmount: 200 },
  { Id: "10629", FeeName: "Change of User (Beach Plots)", FFAFeeName: "Change of User (Beach Plots)", FeeAmount: 20000 },
  { Id: "10630", FeeName: "Change of User (Other areas)", FFAFeeName: "Change of User (Other areas)", FeeAmount: 10000 },
  { Id: "10631", FeeName: "LFTS", FFAFeeName: "LFTS", FeeAmount: 800 },
  { Id: "10632", FeeName: "Initial Mining Approval Fees", FFAFeeName: "Initial Mining Approval Fees", FeeAmount: 100000 },
  { Id: "10633", FeeName: "Small Scale Company Prospective Mining Permit", FFAFeeName: "Small Scale Company Prospective Mining Permit", FeeAmount: 100000 },
  { Id: "10634", FeeName: "Salary Recovery", FFAFeeName: "Salary Recovery", FeeAmount: 2500 },
  { Id: "10635", FeeName: "Change of Business Name", FFAFeeName: "Change of Business Name", FeeAmount: 5000 },
  { Id: "10636", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 3200 },
  { Id: "10637", FeeName: "Annual Reserved Parking Fees - Saloon Car", FFAFeeName: "Annual Reserved Parking Fees - Saloon Car", FeeAmount: 24000 },
  { Id: "10638", FeeName: "Ground Rent", FFAFeeName: "Ground Rent", FeeAmount: 29000 },
  { Id: "10639", FeeName: "sugar cane", FFAFeeName: "sugar cane", FeeAmount: 1 },
  { Id: "10641", FeeName: "Taru Hill Lease rental", FFAFeeName: "Taru Hill Lease rental", FeeAmount: 390000 },
  { Id: "10642", FeeName: "Hire of Amphitheatre", FFAFeeName: "Hire of Amphitheatre", FeeAmount: 10000 },
  { Id: "10643", FeeName: "Muguka/Miraa Offloading - Pick up", FFAFeeName: "Muguka/Miraa Offloading - Pick up", FeeAmount: 80000 },
  { Id: "10644", FeeName: "Muguka/Miraa Offloading - Probox or other small vehicle", FFAFeeName: "Muguka/Miraa Offloading - Probox or other small vehicle", FeeAmount: 60000 },
  { Id: "10645", FeeName: "Muguka/Miraa Offloading - Canter", FFAFeeName: "Muguka/Miraa Offloading - Canter", FeeAmount: 100000 },
  { Id: "10646", FeeName: "Muguka/Miraa Offloading - Lorry 5 to 7 Tonnes", FFAFeeName: "Muguka/Miraa Offloading - Lorry 5 to 7 Tonnes", FeeAmount: 150000 },
  { Id: "10647", FeeName: "Muguka/Miraa Offloading - Lorry 7 to 15 Tonnes", FFAFeeName: "Muguka/Miraa Offloading - Lorry 7 to 15 Tonnes", FeeAmount: 200000 },
  { Id: "10648", FeeName: "Muguka/Miraa Offloading - Lorry above 15 Tonnes", FFAFeeName: "Muguka/Miraa Offloading - Lorry above 15 Tonnes", FeeAmount: 300000 },
  { Id: "10649", FeeName: "Muguka/Miraa Offloading - Tuktuk", FFAFeeName: "Muguka/Miraa Offloading - Tuktuk", FeeAmount: 40000 },
  { Id: "10650", FeeName: "Muguka/Miraa Offloading - Motorbike", FFAFeeName: "Muguka/Miraa Offloading - Motorbike", FeeAmount: 30000 },
  { Id: "10651", FeeName: "Muguka/Miraa Offloading - Sack", FFAFeeName: "Muguka/Miraa Offloading - Sack", FeeAmount: 20000 },
  { Id: "10652", FeeName: "Muguka/Miraa Offloading - Box/Basin/Bucket or equivalent", FFAFeeName: "Muguka/Miraa Offloading - Box/Basin/Bucket or equivalent", FeeAmount: 10000 },
  { Id: "10653", FeeName: "Lorries/Buses/Canters Border Parking Fees", FFAFeeName: "Lorries/Buses/Canters Border Parking Fees", FeeAmount: 500 },
  { Id: "10654", FeeName: "Two Face Clock Advertisement", FFAFeeName: "Two Face Clock Advertisement", FeeAmount: 30000 },
  { Id: "10655", FeeName: "Other Vehicles Reserved Parking Fee per slot", FFAFeeName: "Other Vehicles Reserved Parking Fee per slot", FeeAmount: 3500 },
  { Id: "10656", FeeName: "Auction Fees-sheep/goat", FFAFeeName: "Auction Fees-sheep/goat", FeeAmount: 40 },
  { Id: "10657", FeeName: "Auction Fees-cattle per day", FFAFeeName: "Auction Fees-cattle per day", FeeAmount: 120 },
  { Id: "10658", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Pick-up", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Pick-up", FeeAmount: 300 },
  { Id: "10659", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Canter", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Canter", FeeAmount: 500 },
  { Id: "10660", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Lorry 7-10 tonnes", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Lorry 7-10 tonnes", FeeAmount: 700 },
  { Id: "10661", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Lorry above 10 tonnes", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Lorry above 10 tonnes", FeeAmount: 1400 },
  { Id: "10662", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Trailer", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Trailer", FeeAmount: 3000 },
  { Id: "10663", FeeName: "Homa lime Produce/Sand/chips/Quarry dust - Hand Cart (Mkokoteni)", FFAFeeName: "Homa lime Produce/Sand/chips/Quarry dust - Hand Cart (Mkokoteni)", FeeAmount: 200 },
  { Id: "10664", FeeName: "Stone/Ballast/Murram - Pick-up", FFAFeeName: "Stone/Ballast/Murram - Pick-up", FeeAmount: 400 },
  { Id: "10665", FeeName: "Stone/Ballast/Murram - Canter", FFAFeeName: "Stone/Ballast/Murram - Canter", FeeAmount: 600 },
  { Id: "10666", FeeName: "Stone/Ballast/Murram - Lorry 7-10 tonnes", FFAFeeName: "Stone/Ballast/Murram - Lorry 7-10 tonnes", FeeAmount: 800 },
  { Id: "10667", FeeName: "Stone/Ballast/Murram - Lorry above 10 tonnes", FFAFeeName: "Stone/Ballast/Murram - Lorry above 10 tonnes", FeeAmount: 1800 },
  { Id: "10668", FeeName: "Stone/Ballast/Murram - Trailer", FFAFeeName: "Stone/Ballast/Murram - Trailer", FeeAmount: 3500 },
  { Id: "10669", FeeName: "Top Soil - Pick-up", FFAFeeName: "Top Soil - Pick-up", FeeAmount: 1000 },
  { Id: "10670", FeeName: "Top Soil - Canter", FFAFeeName: "Top Soil - Canter", FeeAmount: 2000 },
  { Id: "10671", FeeName: "Top Soil - Lorry 7-10 tonnes", FFAFeeName: "Top Soil - Lorry 7-10 tonnes", FeeAmount: 3500 },
  { Id: "10672", FeeName: "Top Soil - Lorry above 10 tonnes", FFAFeeName: "Top Soil - Lorry above 10 tonnes", FeeAmount: 5000 },
  { Id: "10673", FeeName: "Slates (Improved Galana) - Pick-up", FFAFeeName: "Slates (Improved Galana) - Pick-up", FeeAmount: 750 },
  { Id: "10674", FeeName: "Slates (Improved Galana) - Canter", FFAFeeName: "Slates (Improved Galana) - Canter", FeeAmount: 1250 },
  { Id: "10675", FeeName: "Slates (Improved Galana) - Lorry 7-10 tonnes", FFAFeeName: "Slates (Improved Galana) - Lorry 7-10 tonnes", FeeAmount: 1750 },
  { Id: "10676", FeeName: "Slates (Improved Galana) - Lorry above 10 tonnes", FFAFeeName: "Slates (Improved Galana) - Lorry above 10 tonnes", FeeAmount: 3500 },
  { Id: "10677", FeeName: "Slates (Improved Galana) - Trailer", FFAFeeName: "Slates (Improved Galana) - Trailer", FeeAmount: 7500 },
  { Id: "10678", FeeName: "Slabs/Gallana - Pick-up", FFAFeeName: "Slabs/Gallana - Pick-up", FeeAmount: 600 },
  { Id: "10679", FeeName: "Slabs/Gallana - Canter", FFAFeeName: "Slabs/Gallana - Canter", FeeAmount: 1000 },
  { Id: "10680", FeeName: "Slabs/Gallana - Lorry 7-10 tonnes", FFAFeeName: "Slabs/Gallana - Lorry 7-10 tonnes", FeeAmount: 1400 },
  { Id: "10681", FeeName: "Slabs/Gallana - Lorry above 10 tonnes", FFAFeeName: "Slabs/Gallana - Lorry above 10 tonnes", FeeAmount: 2800 },
  { Id: "10682", FeeName: "Slabs/Gallana - Trailer", FFAFeeName: "Slabs/Gallana - Trailer", FeeAmount: 6000 },
  { Id: "10683", FeeName: "Slabs/Gallana - Hand Cart (Mkokoteni)", FFAFeeName: "Slabs/Gallana - Hand Cart (Mkokoteni)", FeeAmount: 200 },
  { Id: "10684", FeeName: "Silica/White Sand - Pick up", FFAFeeName: "Silica/White Sand - Pick up", FeeAmount: 1200 },
  { Id: "10685", FeeName: "Silica/White Sand - Canter", FFAFeeName: "Silica/White Sand - Canter", FeeAmount: 2000 },
  { Id: "10686", FeeName: "Silica/White Sand - Lorry 7 to 10 Tonnes", FFAFeeName: "Silica/White Sand - Lorry 7 to 10 Tonnes", FeeAmount: 3500 },
  { Id: "10687", FeeName: "Silica/White Sand - Lorry above 10 Tonnes", FFAFeeName: "Silica/White Sand - Lorry above 10 Tonnes", FeeAmount: 5000 },
  { Id: "10688", FeeName: "Silica/White Sand - Trailer", FFAFeeName: "Silica/White Sand - Trailer", FeeAmount: 10000 },
  { Id: "10689", FeeName: "Pickups/Tractors", FFAFeeName: "Pickups/Tractors", FeeAmount: 500 },
  { Id: "10690", FeeName: "Lorries 7 tonnes - 15 tonnes", FFAFeeName: "Lorries 7 tonnes - 15 tonnes", FeeAmount: 2000 },
  { Id: "10691", FeeName: "Lorries above 15 tonnes", FFAFeeName: "Lorries above 15 tonnes", FeeAmount: 3000 },
  { Id: "10692", FeeName: "Mkokoteni/Handcart/Tuktuk", FFAFeeName: "Mkokoteni/Handcart/Tuktuk", FeeAmount: 200 },
  { Id: "10693", FeeName: "Commercial vehicle entry/Movement fee - Tuktuk", FFAFeeName: "Commercial vehicle entry/Movement fee - Tuktuk", FeeAmount: 100 },
  { Id: "10694", FeeName: "Commercial vehicle entry/Movement fee - Trailers/Buses", FFAFeeName: "Commercial vehicle entry/Movement fee - Trailers/Buses", FeeAmount: 500 },
  { Id: "10695", FeeName: "Commercial vehicle entry/Movement fee - Other vehicles", FFAFeeName: "Commercial vehicle entry/Movement fee - Other vehicles", FeeAmount: 300 },
  { Id: "10696", FeeName: "Annual Sticker Fee for cess and royalties vehicles", FFAFeeName: "Annual Sticker Fee for cess and royalties vehicles", FeeAmount: 3000 },
  { Id: "10697", FeeName: "Saloon, Station Wagons & Pickups", FFAFeeName: "Saloon, Station Wagons & Pickups", FeeAmount: 50 },
  { Id: "10698", FeeName: "Canters", FFAFeeName: "Canters", FeeAmount: 150 },
  { Id: "10699", FeeName: "Lorries/ Buses", FFAFeeName: "Lorries/ Buses", FeeAmount: 250 },
  { Id: "10700", FeeName: "Taxi Monthly Parking Fees", FFAFeeName: "Taxi Monthly Parking Fees", FeeAmount: 2000 },
  { Id: "10701", FeeName: "Other Vehicles Reserved Parking Fee per slot", FFAFeeName: "Other Vehicles Reserved Parking Fee per slot", FeeAmount: 3500 },
  { Id: "10702", FeeName: "Buses Reserved Parking Fee per slot", FFAFeeName: "Buses Reserved Parking Fee per slot", FeeAmount: 5000 },
  { Id: "10703", FeeName: "Motorcycle Annual Parking Fees", FFAFeeName: "Motorcycle Annual Parking Fees", FeeAmount: 1500 },
  { Id: "10704", FeeName: "Cotton", FFAFeeName: "Cotton", FeeAmount: 1 },
  { Id: "10705", FeeName: "Sea weed", FFAFeeName: "Sea weed", FeeAmount: 500 },
  { Id: "10706", FeeName: "Citrus", FFAFeeName: "Citrus", FeeAmount: 500 },
  { Id: "10707", FeeName: "Mangoes", FFAFeeName: "Mangoes", FeeAmount: 500 },
  { Id: "10708", FeeName: "Dry Maize", FFAFeeName: "Dry Maize", FeeAmount: 100 },
  { Id: "10709", FeeName: "Sorghum", FFAFeeName: "Sorghum", FeeAmount: 100 },
  { Id: "10710", FeeName: "Rice", FFAFeeName: "Rice", FeeAmount: 100 },
  { Id: "10711", FeeName: "Annual plot rent", FFAFeeName: "Annual plot rent", FeeAmount: 6000 },
  { Id: "10712", FeeName: "Annual Market Stall Rent in major Towns", FFAFeeName: "Annual Market Stall Rent in major Towns", FeeAmount: 42000 },
  { Id: "10713", FeeName: "Bi-annual Market Stall Rent in major Towns", FFAFeeName: "Bi-annual Market Stall Rent in major Towns", FeeAmount: 21000 },
  { Id: "10714", FeeName: "Monthly Market Stall Rent in major Towns", FFAFeeName: "Monthly Market Stall Rent in major Towns", FeeAmount: 1500 },
  { Id: "10715", FeeName: "Annual Market Stall Rent in other Towns", FFAFeeName: "Annual Market Stall Rent in other Towns", FeeAmount: 30000 },
  { Id: "10716", FeeName: "Bi-annual Market Stall Rent in other Towns", FFAFeeName: "Bi-annual Market Stall Rent in other Towns", FeeAmount: 15000 },
  { Id: "10717", FeeName: "Monthly Market Stall Rent in other Towns", FFAFeeName: "Monthly Market Stall Rent in other Towns", FeeAmount: 1200 },
  { Id: "10718", FeeName: "Toilet Usage Per Person", FFAFeeName: "Toilet Usage Per Person", FeeAmount: 10 },
  { Id: "10719", FeeName: "Annual Hotel Rent in major Towns", FFAFeeName: "Annual Hotel Rent in major Towns", FeeAmount: 72000 },
  { Id: "10720", FeeName: "Bi-annual Hotel Rent in major Towns", FFAFeeName: "Bi-annual Hotel Rent in major Towns", FeeAmount: 36000 },
  { Id: "10721", FeeName: "Monthly Hotel Rent in major Towns", FFAFeeName: "Monthly Hotel Rent in major Towns", FeeAmount: 6000 },
  { Id: "10722", FeeName: "Annual Hotel Rent in other Towns", FFAFeeName: "Annual Hotel Rent in other Towns", FeeAmount: 48000 },
  { Id: "10723", FeeName: "Bi-annual Hotel Rent in other Towns", FFAFeeName: "Bi-annual Hotel Rent in other Towns", FeeAmount: 24000 },
  { Id: "10724", FeeName: "Monthly Hotel Rent in other Towns", FFAFeeName: "Monthly Hotel Rent in other Towns", FeeAmount: 4000 },
  { Id: "10725", FeeName: "Annual Butchery Rent in major Towns", FFAFeeName: "Annual Butchery Rent in major Towns", FeeAmount: 48000 },
  { Id: "10726", FeeName: "Bi-annual Butchery Rent in major Towns", FFAFeeName: "Bi-annual Butchery Rent in major Towns", FeeAmount: 24000 },
  { Id: "10727", FeeName: "Monthlyl Butchery Rent in major Towns", FFAFeeName: "Monthlyl Butchery Rent in major Towns", FeeAmount: 4000 },
  { Id: "10728", FeeName: "Annual Butchery Rent in other Towns", FFAFeeName: "Annual Butchery Rent in other Towns", FeeAmount: 36000 },
  { Id: "10729", FeeName: "Bi-annual Butchery Rent in other Towns", FFAFeeName: "Bi-annual Butchery Rent in other Towns", FeeAmount: 18000 },
  { Id: "10730", FeeName: "Monthlyl Butchery Rent in other Towns", FFAFeeName: "Monthlyl Butchery Rent in other Towns", FeeAmount: 3000 },
  { Id: "10731", FeeName: "Annual Shop Stall Rent in major Towns", FFAFeeName: "Annual Shop Stall Rent in major Towns", FeeAmount: 42000 },
  { Id: "10732", FeeName: "Bi-annual Shop Stall Rent in major Towns", FFAFeeName: "Bi-annual Shop Stall Rent in major Towns", FeeAmount: 21000 },
  { Id: "10733", FeeName: "Monthly Shop Stall Rent in major Towns", FFAFeeName: "Monthly Shop Stall Rent in major Towns", FeeAmount: 3500 },
  { Id: "10734", FeeName: "Annual Shop Stall Rent in other Towns", FFAFeeName: "Annual Shop Stall Rent in other Towns", FeeAmount: 30000 },
  { Id: "10735", FeeName: "Bi-annual Shop Stall Rent in other Towns", FFAFeeName: "Bi-annual Shop Stall Rent in other Towns", FeeAmount: 15000 },
  { Id: "10736", FeeName: "Monthly Shop Stall Rent in other Towns", FFAFeeName: "Monthly Shop Stall Rent in other Towns", FeeAmount: 2500 },
  { Id: "10737", FeeName: "Permit to operate a market in a prescribed area- Annual", FFAFeeName: "Permit to operate a market in a prescribed area- Annual", FeeAmount: 100000 },
  { Id: "10738", FeeName: "Annual maintenance of Fiber Optic Permit - Large company", FFAFeeName: "Annual maintenance of Fiber Optic Permit - Large company", FeeAmount: 100000 },
  { Id: "10739", FeeName: "Annual maintenance of Fiber Optic Permit - Medium company", FFAFeeName: "Annual maintenance of Fiber Optic Permit - Medium company", FeeAmount: 50000 },
  { Id: "10740", FeeName: "Annual maintenance of Fiber Optic Permit - Small company", FFAFeeName: "Annual maintenance of Fiber Optic Permit - Small company", FeeAmount: 20000 },
  { Id: "10741", FeeName: "Transportation Company: Over 30 vehicles.", FFAFeeName: "Transportation Company: Over 30 vehicles.", FeeAmount: 120000 },
  { Id: "10742", FeeName: "Transportation Company: From 21 to 30 vehicles.", FFAFeeName: "Transportation Company: From 21 to 30 vehicles.", FeeAmount: 80000 },
  { Id: "10743", FeeName: "Transportation Company: From 10 to 20 vehicles.", FFAFeeName: "Transportation Company: From 10 to 20 vehicles.", FeeAmount: 45000 },
  { Id: "10744", FeeName: "Transportation Company: From 6 to 9 vehicles.", FFAFeeName: "Transportation Company: From 6 to 9 vehicles.", FeeAmount: 20000 },
  { Id: "10745", FeeName: "Transportation Company: From 2 to 5 vehicles.", FFAFeeName: "Transportation Company: From 2 to 5 vehicles.", FeeAmount: 18000 },
  { Id: "10746", FeeName: "Distributors License", FFAFeeName: "Distributors License", FeeAmount: 10000 },
  { Id: "10747", FeeName: "Large Petrol Filling Station: Over 4 pumps or with garage-workshop & retail shop.", FFAFeeName: "Large Petrol Filling Station: Over 4 pumps or with garage-workshop & retail shop.", FeeAmount: 40000 },
  { Id: "10748", FeeName: "Medium Petrol Filling Station: Up to 3 pumps or with garage-workshop or retail shop.", FFAFeeName: "Medium Petrol Filling Station: Up to 3 pumps or with garage-workshop or retail shop.", FeeAmount: 20000 },
  { Id: "10749", FeeName: "Small Petrol Filling Station: Up to 3 pumps and without garage-workshop or retail shop.", FFAFeeName: "Small Petrol Filling Station: Up to 3 pumps and without garage-workshop or retail shop.", FeeAmount: 12000 },
  { Id: "10750", FeeName: "Large Cold Storage Facility: Over 1,000 m2, insulated walls, cold production equipment.", FFAFeeName: "Large Cold Storage Facility: Over 1,000 m2, insulated walls, cold production equipment.", FeeAmount: 90000 },
  { Id: "10751", FeeName: "Small Cold Storage Facility: Below 100 m2.", FFAFeeName: "Small Cold Storage Facility: Below 100 m2.", FeeAmount: 15000 },
  { Id: "10752", FeeName: "Large Storage Facility: Over 1000 m2. Go down, Warehouse. Liquid Storage Tanks Complex.", FFAFeeName: "Large Storage Facility: Over 1000 m2. Go down, Warehouse. Liquid Storage Tanks Complex.", FeeAmount: 80000 },

    // Previous entries would be here...
  // New entries below:
  { Id: "10753", FeeName: "Medium Storage Facility: From 500 to 1,000 m2", FFAFeeName: "Medium Storage Facility: From 500 to 1,000 m2", FeeAmount: 40000 },
  { Id: "10754", FeeName: "Small Storage Facility: Below 500 m2", FFAFeeName: "Small Storage Facility: Below 500 m2", FeeAmount: 20000 },
  { Id: "10755", FeeName: "Large Communications Company: Over 50 employees and/or premises over 5,000 m2", FFAFeeName: "Large Communications Company: Over 50 employees and/or premises over 5,000 m2", FeeAmount: 150000 },
  { Id: "10756", FeeName: "Medium Communications Co. From 10 to 50 employees and/or premises from 1,500 to 5,000 m2", FFAFeeName: "Medium Communications Co. From 10 to 50 employees and/or premises from 1,500 to 5,000 m2", FeeAmount: 97600 },
  { Id: "10757", FeeName: "Small Communications Co. below 10 employees and/or premises below 1,500 m2", FFAFeeName: "Small Communications Co. below 10 employees and/or premises below 1,500 m2", FeeAmount: 30000 },
  { Id: "10758", FeeName: "GSM communication base", FFAFeeName: "GSM communication base", FeeAmount: 100000 },
  { Id: "10759", FeeName: "Small Bar/Traditional Beer Seller: Capacity up to 15 customers", FFAFeeName: "Small Bar/Traditional Beer Seller: Capacity up to 15 customers", FeeAmount: 6000 },
  { Id: "10760", FeeName: "Large Night Club / Casino: Over 500 m2 and over 15 employees", FFAFeeName: "Large Night Club / Casino: Over 500 m2 and over 15 employees", FeeAmount: 40000 },
  { Id: "10761", FeeName: "Medium Night Club/Casino: From 101 to 500 m2 and from 10 to 14 employees", FFAFeeName: "Medium Night Club/Casino: From 101 to 500 m2 and from 10 to 14 employees", FeeAmount: 25000 },
  { Id: "10762", FeeName: "Small Night Club/Casino: Up to 100 m2 Up to 9 employees", FFAFeeName: "Small Night Club/Casino: Up to 100 m2 Up to 9 employees", FeeAmount: 18000 },
  { Id: "10763", FeeName: "Other Catering and Accommodation and event management", FFAFeeName: "Other Catering and Accommodation and event management", FeeAmount: 6000 },
  { Id: "10764", FeeName: "Large Entertainment Facility: Cinema-Theatre-Vedio Show(over 100 seats), Amusement-Juke Box-Games Machine Arcedes (over 10 machines),Sports Club Gym (over 50 members)", FFAFeeName: "Large Entertainment Facility: Cinema-Theatre-Vedio Show(over 100 seats), Amusement-Juke Box-Games Machine Arcedes (over 10 machines),Sports Club Gym (over 50 members)", FeeAmount: 80000 },
  { Id: "10765", FeeName: "Medium Entertainment Facility: From 50 to 100 seats; from 4 to 10 machines; from 16 to 50 members", FFAFeeName: "Medium Entertainment Facility: From 50 to 100 seats; from 4 to 10 machines; from 16 to 50 members", FeeAmount: 45000 },
  { Id: "10766", FeeName: "Small Entertainment Facility: Up to 50 seats; Up to 3 machines; Up to 15 members", FFAFeeName: "Small Entertainment Facility: Up to 50 seats; Up to 3 machines; Up to 15 members", FeeAmount: 8000 },
  { Id: "10767", FeeName: "Small Industrial Plant: Up to 15 employees or premises below 100 m2", FFAFeeName: "Small Industrial Plant: Up to 15 employees or premises below 100 m2", FeeAmount: 60000 },
  { Id: "10768", FeeName: "Small Workshop/Service-Repair Contractor: Up to 5 employees or premises below 25 m2", FFAFeeName: "Small Workshop/Service-Repair Contractor: Up to 5 employees or premises below 25 m2", FeeAmount: 12000 },
  { Id: "10769", FeeName: "Large high Standard Private Health Facility:Hospital,Clinic, Nursing Home (with inpatient laboratory and X-ray services)Capacity over 20 beds", FFAFeeName: "Large high Standard Private Health Facility:Hospital,Clinic, Nursing Home (with inpatient laboratory and X-ray services)Capacity over 20 beds", FeeAmount: 60000 },
  { Id: "10770", FeeName: "Medium High Standard Private Health Facility:Hospital,Clinic,Nursing Home (with inpatient laboratory and X-ray services),capacity 11 to 20 beds", FFAFeeName: "Medium High Standard Private Health Facility:Hospital,Clinic,Nursing Home (with inpatient laboratory and X-ray services),capacity 11 to 20 beds", FeeAmount: 40000 },
  { Id: "10771", FeeName: "Small High Standard Private Health Facility: Hospital,Clinic,Nursing Home (with inpatient laboratory and X-ray services), Capacity up to 10 beds", FFAFeeName: "Small High Standard Private Health Facility: Hospital,Clinic,Nursing Home (with inpatient laboratory and X-ray services), Capacity up to 10 beds", FeeAmount: 20000 },
  { Id: "10772", FeeName: "Small Private Health Facility: Hospital ,Clinic ,Nursing Home (with outpatient and dispensing services) in a fair location", FFAFeeName: "Small Private Health Facility: Hospital ,Clinic ,Nursing Home (with outpatient and dispensing services) in a fair location", FeeAmount: 10000 },
  { Id: "10773", FeeName: "Groceries and small eating-house of any size in a faraway location", FFAFeeName: "Groceries and small eating-house of any size in a faraway location", FeeAmount: 3200 },
  { Id: "10774", FeeName: "Quarries and small mining operation", FFAFeeName: "Quarries and small mining operation", FeeAmount: 50000 },
  { Id: "10775", FeeName: "Posho mills", FFAFeeName: "Posho mills", FeeAmount: 4000 },
  { Id: "10776", FeeName: "Other Agricultural, Forestry, and Nature Resources", FFAFeeName: "Other Agricultural, Forestry, and Nature Resources", FeeAmount: 3200 },
  { Id: "10777", FeeName: "Large High Standard Lodging House/Hotel,D Class:From 41 to 100 rooms and/or rated as Four Star", FFAFeeName: "Large High Standard Lodging House/Hotel,D Class:From 41 to 100 rooms and/or rated as Four Star", FeeAmount: 180000 },
  { Id: "10778", FeeName: "Medium High Standard Lodging House/hotel, D Class:Up to 40 rooms and/or rated as Two Star", FFAFeeName: "Medium High Standard Lodging House/hotel, D Class:Up to 40 rooms and/or rated as Two Star", FeeAmount: 80000 },
  { Id: "10779", FeeName: "water sports activities", FFAFeeName: "water sports activities", FeeAmount: 10000 },
  { Id: "10780", FeeName: "Other Education, Health, and Education", FFAFeeName: "Other Education, Health, and Education", FeeAmount: 6000 },
  { Id: "10781", FeeName: "Canters/Lorries up to 5 Tonnes", FFAFeeName: "Canters/Lorries up to 5 Tonnes", FeeAmount: 1500 },
  { Id: "10782", FeeName: "Offloading charges within County markets-Canters/Lorries up to 5 Tonnes", FFAFeeName: "Offloading charges within County markets-Canters/Lorries up to 5 Tonnes", FeeAmount: 1500 },
  { Id: "10783", FeeName: "Offloading charges within County markets-Tuk Tuk", FFAFeeName: "Offloading charges within County markets-Tuk Tuk", FeeAmount: 300 },
  { Id: "10784", FeeName: "Offloading charges within County markets-Mini Buses", FFAFeeName: "Offloading charges within County markets-Mini Buses", FeeAmount: 500 },
  { Id: "10785", FeeName: "Offloading charges within County markets-Lorries above 5 - 7 Tonnes", FFAFeeName: "Offloading charges within County markets-Lorries above 5 - 7 Tonnes", FeeAmount: 2000 },
  { Id: "10786", FeeName: "Offloading charges within County markets-Lorries above 7 - 15 Tonnes", FFAFeeName: "Offloading charges within County markets-Lorries above 7 - 15 Tonnes", FeeAmount: 3000 },
  { Id: "10787", FeeName: "Offloading charges within County markets-Lorries above 15 Tonnes", FFAFeeName: "Offloading charges within County markets-Lorries above 15 Tonnes", FeeAmount: 5000 },
  { Id: "10788", FeeName: "Offloading charges within County markets-Motorbike (Bodaboda)", FFAFeeName: "Offloading charges within County markets-Motorbike (Bodaboda)", FeeAmount: 100 },
  { Id: "10789", FeeName: "Offloading Charges in other areas within the County-Canters/Lorries up to 5 Tonnes", FFAFeeName: "Offloading Charges in other areas within the County-Canters/Lorries up to 5 Tonnes", FeeAmount: 1000 },
  { Id: "10790", FeeName: "Offloading Charges in other areas within the County-Motorbike(Bodaboda)", FFAFeeName: "Offloading Charges in other areas within the County-Motorbike(Bodaboda)", FeeAmount: 200 },
  { Id: "10791", FeeName: "Offloading Charges in other areas within the County-Tuk tuk", FFAFeeName: "Offloading Charges in other areas within the County-Tuk tuk", FeeAmount: 300 },
  { Id: "10792", FeeName: "Offloading Charges in other areas within the County-Lorries above 5 - 7 Tonnes", FFAFeeName: "Offloading Charges in other areas within the County-Lorries above 5 - 7 Tonnes", FeeAmount: 1500 },
  { Id: "10793", FeeName: "Offloading Charges in other areas within the County-Lorries above 7 - 15 Tonnes", FFAFeeName: "Offloading Charges in other areas within the County-Lorries above 7 - 15 Tonnes", FeeAmount: 2000 },
  { Id: "10794", FeeName: "Offloading Charges in other areas within the County-Lorries above 15 Tonnes", FFAFeeName: "Offloading Charges in other areas within the County-Lorries above 15 Tonnes", FeeAmount: 3000 },
  { Id: "10795", FeeName: "Other Charges-Open air sell without motor vehicle", FFAFeeName: "Other Charges-Open air sell without motor vehicle", FeeAmount: 150 },
  { Id: "10796", FeeName: "Other Charges-Impounded Goods", FFAFeeName: "Other Charges-Impounded Goods", FeeAmount: 200 },
  { Id: "10797", FeeName: "Open air sell per vehicle per day-Pickup/Probox", FFAFeeName: "Open air sell per vehicle per day-Pickup/Probox", FeeAmount: 500 },
  { Id: "10798", FeeName: "Open air sell per vehicle per day-Other vehicles", FFAFeeName: "Open air sell per vehicle per day-Other vehicles", FeeAmount: 1000 },
  { Id: "10799", FeeName: "Plot Survey Fees", FFAFeeName: "Plot Survey Fees", FeeAmount: 3000 },
  { Id: "10800", FeeName: "Standing Premium", FFAFeeName: "Standing Premium", FeeAmount: 3000 },
  { Id: "10801", FeeName: "Plot Showing Fees", FFAFeeName: "Plot Showing Fees", FeeAmount: 1000 },
  { Id: "10802", FeeName: "Plot Allocation Administration cost", FFAFeeName: "Plot Allocation Administration cost", FeeAmount: 500 },
  { Id: "10803", FeeName: "Deposit on application of Plot", FFAFeeName: "Deposit on application of Plot", FeeAmount: 3000 },
  { Id: "10804", FeeName: "Building Occupation Certificate Fee", FFAFeeName: "Building Occupation Certificate Fee", FeeAmount: 3000 },
  { Id: "10805", FeeName: "Large-High Standard Lodging House/Hotel D Class", FFAFeeName: "Large-High Standard Lodging House/Hotel D Class", FeeAmount: 40000 },
  { Id: "10806", FeeName: "Medium-High Standard Lodging House / Hotel D Class", FFAFeeName: "Medium-High Standard Lodging House / Hotel D Class", FeeAmount: 28000 },
  { Id: "10807", FeeName: "Small-High Standard Lodging House/Hotel D Class", FFAFeeName: "Small-High Standard Lodging House/Hotel D Class", FeeAmount: 20000 },
  { Id: "10808", FeeName: "Large Lodging House with Restaurant and/ or Bar B / C Class", FFAFeeName: "Large Lodging House with Restaurant and/ or Bar B / C Class", FeeAmount: 18000 },
  { Id: "10809", FeeName: "Medium Lodging House with Restaurant and/ or Bar B / C Class", FFAFeeName: "Medium Lodging House with Restaurant and/ or Bar B / C Class", FeeAmount: 14000 },
  { Id: "10810", FeeName: "Small Lodging House with Restaurant and/ or Bar B / C Class", FFAFeeName: "Small Lodging House with Restaurant and/ or Bar B / C Class", FeeAmount: 10000 },
  { Id: "10811", FeeName: "Large Lodging House B / C Class", FFAFeeName: "Large Lodging House B / C Class", FeeAmount: 16000 },
  { Id: "10812", FeeName: "Medium Lodging House B / C Class", FFAFeeName: "Medium Lodging House B / C Class", FeeAmount: 10000 },
  { Id: "10813", FeeName: "Small Lodging House B/C Class", FFAFeeName: "Small Lodging House B/C Class", FeeAmount: 6000 },
  { Id: "10814", FeeName: "Large Restaurant with Bar/Membership Club", FFAFeeName: "Large Restaurant with Bar/Membership Club", FeeAmount: 12000 },
  { Id: "10815", FeeName: "Medium Restaurant with Bar/Membership Club", FFAFeeName: "Medium Restaurant with Bar/Membership Club", FeeAmount: 6000 },
  { Id: "10816", FeeName: "Large Eating House; Snack Bar; Tea House 'Hotel'", FFAFeeName: "Large Eating House; Snack Bar; Tea House 'Hotel'", FeeAmount: 6000 },
  { Id: "10817", FeeName: "Medium Eating House; Snack Bar; Tea House 'Hotel'", FFAFeeName: "Medium Eating House; Snack Bar; Tea House 'Hotel'", FeeAmount: 4000 },
  { Id: "10818", FeeName: "Small Eating House; Snack Bar; Tea House 'Hotel'", FFAFeeName: "Small Eating House; Snack Bar; Tea House 'Hotel'", FeeAmount: 2800 },
  { Id: "10819", FeeName: "Butchery with Roasted Meat and / or Soup Kitchen", FFAFeeName: "Butchery with Roasted Meat and / or Soup Kitchen", FeeAmount: 4000 },
  { Id: "10820", FeeName: "Large Bar/Traditional Beer Seller", FFAFeeName: "Large Bar/Traditional Beer Seller", FeeAmount: 6000 },
  { Id: "10821", FeeName: "Medium Bar/Traditional Beer Seller", FFAFeeName: "Medium Bar/Traditional Beer Seller", FeeAmount: 4800 },
  { Id: "10822", FeeName: "Small Bar/Traditional Beer Seller", FFAFeeName: "Small Bar/Traditional Beer Seller", FeeAmount: 3200 },
  { Id: "10823", FeeName: "Large Night Club / Casino", FFAFeeName: "Large Night Club / Casino", FeeAmount: 20000 },
  { Id: "10824", FeeName: "Transportation Company", FFAFeeName: "Transportation Company", FeeAmount: 44800 },
  { Id: "10825", FeeName: "Booking office", FFAFeeName: "Booking office", FeeAmount: 18000 },
  { Id: "10826", FeeName: "Large Petrol Filling Station", FFAFeeName: "Large Petrol Filling Station", FeeAmount: 30000 },
  { Id: "10827", FeeName: "Medium Petrol Filling Station", FFAFeeName: "Medium Petrol Filling Station", FeeAmount: 14800 },
  { Id: "10828", FeeName: "Small Petrol Filling Station", FFAFeeName: "Small Petrol Filling Station", FeeAmount: 2800 },
  { Id: "10829", FeeName: "Medium Cold Storage Facility", FFAFeeName: "Medium Cold Storage Facility", FeeAmount: 37200 },
  { Id: "10830", FeeName: "Small Cold Storage Facility", FFAFeeName: "Small Cold Storage Facility", FeeAmount: 4800 },
  { Id: "10831", FeeName: "Large Storage Facility", FFAFeeName: "Large Storage Facility", FeeAmount: 74800 },
  { Id: "10832", FeeName: "Medium Storage Facility", FFAFeeName: "Medium Storage Facility", FeeAmount: 30000 },
  { Id: "10833", FeeName: "Small Storage Facility", FFAFeeName: "Small Storage Facility", FeeAmount: 4000 },
  { Id: "10834", FeeName: "Medium Communications Co.", FFAFeeName: "Medium Communications Co.", FeeAmount: 82400 },
  { Id: "10835", FeeName: "Small Communications Co.", FFAFeeName: "Small Communications Co.", FeeAmount: 12000 },
  { Id: "10836", FeeName: "Large Professional Services Firm", FFAFeeName: "Large Professional Services Firm", FeeAmount: 134800 },
  { Id: "10837", FeeName: "Medium Professional Services Firm", FFAFeeName: "Medium Professional Services Firm", FeeAmount: 87200 },
  { Id: "10838", FeeName: "Small Professional Services Firm", FFAFeeName: "Small Professional Services Firm", FeeAmount: 30000 },
  { Id: "10839", FeeName: "Independent Technical Operator", FFAFeeName: "Independent Technical Operator", FeeAmount: 6800 },
  { Id: "10840", FeeName: "Large Financial Services", FFAFeeName: "Large Financial Services", FeeAmount: 142400 },
  { Id: "10841", FeeName: "Medium Financial Services", FFAFeeName: "Medium Financial Services", FeeAmount: 97600 },
  { Id: "10842", FeeName: "Small Financial Services", FFAFeeName: "Small Financial Services", FeeAmount: 67200 },
  { Id: "10843", FeeName: "Health Clinic/Doctor's Surgery", FFAFeeName: "Health Clinic/Doctor's Surgery", FeeAmount: 4000 },
  { Id: "10844", FeeName: "Large high Standard Private Health Facility", FFAFeeName: "Large high Standard Private Health Facility", FeeAmount: 28000 },
  { Id: "10845", FeeName: "Small Private Health Facility", FFAFeeName: "Small Private Health Facility", FeeAmount: 12000 },
  { Id: "10846", FeeName: "Medium Private Health Facility", FFAFeeName: "Medium Private Health Facility", FeeAmount: 18000 },
  { Id: "10847", FeeName: "Large Industrial Plant", FFAFeeName: "Large Industrial Plant", FeeAmount: 1500000 },
  { Id: "10848", FeeName: "Small Industrial Plant", FFAFeeName: "Small Industrial Plant", FeeAmount: 16000 },
  { Id: "10849", FeeName: "Large Workshop/Service-Repair Contractor", FFAFeeName: "Large Workshop/Service-Repair Contractor", FeeAmount: 74800 },
  { Id: "10850", FeeName: "Medium Workshop/Service-Repair Contractor", FFAFeeName: "Medium Workshop/Service-Repair Contractor", FeeAmount: 8000 },
  { Id: "10851", FeeName: "Small Workshop/Service-Repair Contractor", FFAFeeName: "Small Workshop/Service-Repair Contractor", FeeAmount: 2800 },
  { Id: "10852", FeeName: "Senior house 'a' category", FFAFeeName: "Senior house 'a' category", FeeAmount: 6000 },
  { Id: "10853", FeeName: "Senior house 'b' category", FFAFeeName: "Senior house 'b' category", FeeAmount: 4500 },
  { Id: "10854", FeeName: "Senior house 'c' category", FFAFeeName: "Senior house 'c' category", FeeAmount: 3000 },
  { Id: "10855", FeeName: "VAT On Ground Rent", FFAFeeName: "VAT On Ground Rent", FeeAmount: 16 },
  { Id: "10856", FeeName: "Private Filming/Photo Shooting", FFAFeeName: "Private Filming/Photo Shooting", FeeAmount: 100000 },
  { Id: "10858", FeeName: "VAT On Stall Rent", FFAFeeName: "VAT On Stall Rent", FeeAmount: 16 },
  { Id: "10859", FeeName: "Table Per Month", FFAFeeName: "Table Per Month", FeeAmount: 500 },
  { Id: "10860", FeeName: "Ground Rent Kinarini", FFAFeeName: "Ground Rent Kinarini", FeeAmount: 4080 },
  { Id: "10861", FeeName: "Annual Rent Macknon-Dokata Ranch", FFAFeeName: "Annual Rent Macknon-Dokata Ranch", FeeAmount: null },
  { Id: "10862", FeeName: "Annual Rent Macknon-Dokata Ranch", FFAFeeName: "Annual Rent Macknon-Dokata Ranch", FeeAmount: 228700 },
  { Id: "10863", FeeName: "Annual Rent Macknon-Dokata Ranch", FFAFeeName: "Annual Rent Macknon-Dokata Ranch", FeeAmount: 228700 },
  { Id: "10864", FeeName: "Ground Rent Plot", FFAFeeName: "Ground Rent Plot", FeeAmount: 51728 },
  { Id: "10865", FeeName: "Ground Rent K", FFAFeeName: "Ground Rent K", FeeAmount: 19272 },
  { Id: "10866", FeeName: "Bus Stop Advertisement Annual", FFAFeeName: "Bus Stop Advertisement Annual", FeeAmount: 20000 },
  { Id: "10867", FeeName: "Fire Inspection Certificate Fees - Supermarkets/ Warehouses", FFAFeeName: "Fire Inspection Certificate Fees - Supermarkets/ Warehouses", FeeAmount: 10000 },
  { Id: "10868", FeeName: "Inspection of fire extinguisher", FFAFeeName: "Inspection of fire extinguisher", FeeAmount: 500 },
  { Id: "10869", FeeName: "Fire Inspection Certificate Fees - Factory", FFAFeeName: "Fire Inspection Certificate Fees - Factory", FeeAmount: 15000 },
  { Id: "11867", FeeName: "Fire Inspection Certificate Fees - Transport Yards/ CFS", FFAFeeName: "Fire Inspection Certificate Fees - Transport Yards/ CFS", FeeAmount: 15000 },
  { Id: "12867", FeeName: "Land Amalgamation", FFAFeeName: "Land Amalgamation", FeeAmount: 2500 }
];

const ENTITY_CATEGORIES = ["vehicles", "hospital", "others", "advertisement", "Liquor", "House", "Business", "Property", "Plot"];

export default function PaymentApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: "",
    phoneNumber: "",
    customerName: "",
    emailAddress: "",
    plateNumber: "",
    idNumber: "",
    entityTopay: "",
    amountTopay: "",
    feeId: "",
    quantity: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showReports, setShowReports] = useState(false);
  const [reportData, setReportData] = useState({
    collectors: "",
    dateFrom: "",
    dateTo: "",
    reportType: "pdf",
  });
  const [reportResponse, setReportResponse] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const handleApiLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/proxy/authenticate`,
        {
          username: loginData.username.trim(),
          password: loginData.password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
  
      const data = response.data;
  
      if (data?.responsecode === "1111") {
        setIsAuthenticated(true);
        setAuthToken(data.token || "");
        setFormData(prev => ({
          ...prev,
          userId: data.userid,
          employeename: data.employeename,
          admin_phone: data.admin_phone
        }));
        toast.success("Login successful!");
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Authentication failed";
      toast.error(`API Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    return handleApiLogin(e);
  };

  const formatPhoneNumber = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (cleaned.startsWith("254")) {
      // Already in 254 format
    } else if (cleaned.startsWith("+254")) {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "phoneNumber") {
        try {
          updatedData.phoneNumber = formatPhoneNumber(value);
        } catch (error) {
          toast.error(error.message);
          updatedData.phoneNumber = "";
        }
      }
      return updatedData;
    });
  };

  const handleProceed = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFeeSelection = (e) => {
    const selectedFeeName = e.target.value;
    const selectedFee = HARDCODED_FEES.find(fee => fee.FeeName === selectedFeeName);

    if (selectedFee) {
      setFormData({
        ...formData,
        feeName: selectedFee.FeeName,
        feeId: selectedFee.Id,
        amountTopay: formData.quantity ? (selectedFee.FeeAmount * parseInt(formData.quantity)).toString() : "",
        entityTopay: selectedFee.FFAFeeName
      });
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    const selectedFee = HARDCODED_FEES.find(fee => fee.FeeName === formData.feeName);
    
    setFormData({
      ...formData,
      quantity: quantity,
      amountTopay: selectedFee && quantity ? (selectedFee.FeeAmount * parseInt(quantity)).toString() : ""
    });
  };

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://example.com/generate-report",
        reportData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      const result = response.data;
      if (!response.data.success) throw new Error(result.message || "Failed to generate report");
      setReportResponse(result);
      toast.success("Report generated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Report generation failed";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const payload = {
        userId: formData.userId,
        phoneNumber: formData.phoneNumber,
        customerName: formData.customerName,
        emailAddress: formData.emailAddress,
        plateNumber: formData.plateNumber,
        idNumber: formData.idNumber,
        entityTopay: formData.entityTopay,
        amountTopay: formData.amountTopay,
        feeId: formData.feeId,
        quantity: formData.quantity,
        entityId: "0"
      };
  
      const missingFields = Object.entries(payload)
        .filter(([_, val]) => !val)
        .map(([key]) => key);
  
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      const billingResponse = await axios.post(
        `${API_BASE_URL}/Billing`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { "Authorization": `Bearer ${authToken}` })
          },
        }
      );
  
      const billingResult = billingResponse.data;
  
      const stkPayload = {
        Phone: formData.phoneNumber,
        Amount: formData.amountTopay,
        AccountReference: billingResult.billRefNumber
      };
  
      const stkResponse = await axios.post(
        `https://kwale-hris-api.onrender.com/proxy/stkPush`,
        stkPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const stkResult = stkResponse.data;
  
      alert(
        `✅ Billing & STK Push Successful\n\n` +
        `Billing Ref: ${billingResult.billRefNumber}\n` +
        `Amount: ${formData.amountTopay}\n` +
        `Status: ${billingResult.status}\n\n` +
        `STK: ${stkResult[0]?.CustomerMessage || 'Request sent to phone'}`
      );
  
      setFormData({
        userId: formData.userId,
        phoneNumber: "",
        customerName: "",
        emailAddress: "",
        plateNumber: "",
        idNumber: "",
        entityTopay: "",
        amountTopay: "",
        feeId: "",
        quantity: ""
      });
  
      setStep(1);
  
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Payment submission failed";
  
      alert(`❌ Failed\n\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken("");
    setFormData({
      userId: "",
      phoneNumber: "",
      customerName: "",
      emailAddress: "",
      plateNumber: "",
      idNumber: "",
      entityTopay: "",
      amountTopay: "",
      feeId: "",
      quantity: ""
    });
    setStep(1);
    toast.success("Logged out successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
        <Toaster position="top-center" />
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 relative"
          style={{
            backgroundImage: "url('/back.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.9,
          }}>
          <div className="absolute inset-0 bg-white bg-opacity-70 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpeg" alt="Logo" width={80} height={80} />
            </div>
            <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6">E-Pay Mobile App</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <label className="block text-gray-800 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
              />
              <label className="block text-gray-800 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-center text-gray-700 mt-6 font-semibold">
              Powered by Kwale County Government
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 relative"
        style={{
          backgroundImage: "url('/back.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
        }}>
        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-3xl"></div>
        <div className="relative z-10">
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>

          <div className="flex justify-center mb-4">
            <Image src="/logo.jpeg" alt="Logo" width={80} height={80} />
          </div>
          <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6">E-Pay Mobile App</h2>
          
          {showReports ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800">Generate Report</h3>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <label className="block text-gray-800 font-semibold mb-2">Collectors</label>
                <input
                  type="text"
                  name="collectors"
                  value={reportData.collectors}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter collectors"
                />
                <label className="block text-gray-800 font-semibold mb-2">Date From</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={reportData.dateFrom}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block text-gray-800 font-semibold mb-2">Date To</label>
                <input
                  type="date"
                  name="dateTo"
                  value={reportData.dateTo}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block text-gray-800 font-semibold mb-2">Report Type</label>
                <select
                  name="reportType"
                  value={reportData.reportType}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Generating Report..." : "Generate Report"}
                </button>
              </form>
              {reportResponse && (
                <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Report Output</h4>
                  <pre className="text-sm text-gray-700">{JSON.stringify(reportResponse, null, 2)}</pre>
                </div>
              )}
              <button
                onClick={() => setShowReports(false)}
                className="w-full bg-gray-500 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-gray-700 transition"
              >
                Back to Payment Method
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full ${
                      s === step ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              {step === 1 && (
                <form onSubmit={handleProceed} className="space-y-6">
                  <label className="block text-gray-800 font-semibold mb-2">Payment Method</label>
                  <div className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100">
                    M-Pesa
                  </div>
                  <div className="text-center text-red-600 font-semibold text-sm mt-4">
                    <p>This system exclusively accepts M-Pesa as the authorized payment method for receipting.</p>
                    <p>Cash payments is strictly prohibited by the Kwale County Government.</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                  >
                    Proceed
                  </button>
                </form>
              )}
              
              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-500 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-gray-700 transition"
                  >
                    Back
                  </button>

                  <label className="block text-gray-800 font-semibold mb-2">User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter phone number (e.g., 254722000000)"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter customer name"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email address"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Plate Number</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vehicle plate number"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter national ID/passport number"
                  />

                  <div className="relative">
                    <label className="block text-gray-800 font-semibold mb-2">Fee Name</label>
                    <input
                      type="text"
                      placeholder="Search by fee name or category (e.g. 'CESS')"
                      className="w-full p-2 border border-gray-300 rounded-lg mb-1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      name="feeName"
                      onChange={handleFeeSelection}
                      value={formData.feeName}
                      className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Fee</option>
                      {HARDCODED_FEES
                        .filter(fee => 
                          fee.FeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.FFAFeeName.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(fee => (
                          <option key={fee.Id} value={fee.FeeName}>
                            {fee.FeeName} ({fee.FFAFeeName})
                          </option>
                        ))}
                    </select>
                  </div>

                  <label className="block text-gray-800 font-semibold mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter quantity (0 or more)"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Entity to Pay</label>
                  <select
                    name="entityTopay"
                    value={formData.entityTopay}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select entity to pay</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="hospital">Hospital</option>
                    <option value="others">Others</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="Liquor">Liquor</option>
                    <option value="House">House</option>
                    <option value="Business">Business</option>
                    <option value="Property">Property</option>
                    <option value="Plot">Plot</option>
                  </select>

                  <label className="block text-gray-800 font-semibold mb-2">Fee ID</label>
                  <input
                    type="text"
                    name="feeId"
                    value={formData.feeId}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Amount to Pay</label>
                  <input
                    type="text"
                    name="amountTopay"
                    value={formData.amountTopay}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition"
                  >
                    Review
                  </button>
                </form>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800">Review Your Details</h3>
                  <p><strong>User ID:</strong> {formData.userId}</p>
                  <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
                  <p><strong>Customer Name:</strong> {formData.customerName}</p>
                  <p><strong>Email Address:</strong> {formData.emailAddress || 'N/A'}</p>
                  <p><strong>Plate Number:</strong> {formData.plateNumber || 'N/A'}</p>
                  <p><strong>ID Number:</strong> {formData.idNumber || 'N/A'}</p>
                  <p><strong>Entity to Pay:</strong> {formData.entityTopay}</p>
                  <p><strong>Quantity:</strong> {formData.quantity}</p>
                  <p><strong>Amount to Pay:</strong> {formData.amountTopay}</p>
                  <p><strong>Fee ID:</strong> {formData.feeId}</p>
                  
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-yellow-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-yellow-700 transition"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {loading ? "Submitting..." : "Submit Payment"}
                  </button>

                  {apiResponse && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">API Response</h4>
                      <pre className="text-sm text-gray-700 overflow-auto">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          <p className="text-center text-gray-700 mt-6 font-semibold">
            Powered by Kwale County Government
          </p>
        </div>
      </div>
    </div>
  );
}