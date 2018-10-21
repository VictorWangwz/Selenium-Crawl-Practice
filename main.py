#!/usr/bin/env python3

import os
import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from datetime import datetime
import pytz
import json
import wget
import csv

CSV_FILENAME = "data.csv"
JSON_FILENAME = "data.json"
WEB_DRIVER_DEFAULT_LOAD_SECS = 1


def main():
    driver = create_driver()

    input_file = csv.DictReader(open("./name1.csv"))
    COOKIE_NAME = "li_at"
    COOKIE_CONTENT = " "# add ur own cookie
    DOMAIN = '.www.linkedin.com'
    found_one = []
    driver.add_cookie({'name': COOKIE_NAME, 'value': COOKIE_CONTENT, 'domain': DOMAIN, 'secure': True, 'expiry': '2019-08-21T22:13:44.093Z'})
    for row in input_file:

        result = get_results_data(driver, row)
        if result:
            found_one.append({dict(row)['first_name']:dict(row)['first_name'], dict(row)['last_name']:dict(row)['last_name']})

    with open("name2.csv", 'w') as resultFile:
        wr = csv.writer(resultFile, dialect='excel')
        wr.writerows(found_one)


    driver.quit()

    #save_to_csv(CSV_FILENAME, login_time, contacts_time, open_a_contact_time, deals_time, open_a_deal_time, organization_contacts_time)
    #save_to_js(JSON_FILENAME, login_time, contacts_time, open_a_contact_time, deals_time, open_a_deal_time, organization_contacts_time)

# If chromedriver.exe is not found in this project directory, please download from
# http://chromedriver.storage.googleapis.com/index.html?path=2.30/
# and extract the file into the same directory as this file
def create_driver():
    # get the path of ChromeDriver
    dir = os.path.dirname(os.path.realpath(__file__))
    chrome_driver_path = dir + "/chromedriver"
    
    options = webdriver.ChromeOptions()
    options.add_argument("user-data-dir=/Users/zhenwang/Library/Application\ Support/Google/Chrome/Profile\ 1")
    options.add_argument('nogui')
    # create a new Chrome session
    driver = webdriver.Chrome(chrome_driver_path, chrome_options=options)
    driver.implicitly_wait(30)
    #driver.maximize_window()

    return driver

# logs into MortgageBoss and returns the time taken for the "3 days" tab to load
def get_results_data(driver, row):
    row_first = dict(row)['first_name']
    row_last = dict(row)['last_name']

    URL = "https://www.linkedin.com/search/results/all/?keywords={}%20{}&origin=GLOBAL_SEARCH_HEADER".format(row_first, row_last)

    # navigate to the application home page
    driver.get(URL)
    

    page_height = driver.execute_script("return document.body.scrollHeight")
    driver.execute_script("window.scrollTo(0, " + str(page_height) + ");")

    wait = WebDriverWait(driver, WEB_DRIVER_DEFAULT_LOAD_SECS)    
        

    # NEXT_BUTTON_CLASS = "next-text"
    # next_button = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, NEXT_BUTTON_CLASS)))
    
    #NEXT_BUTTON_CLASS = "next-text"
    #next_button = driver.find_elements_by_class_name(NEXT_BUTTON_CLASS)


    # get all data
    elements = [];
    # elements = driver.find_elements_by_class_name("EntityPhoto-circle-4");
    elements = driver.find_elements_by_class_name("search-result__wrapper")
    for elm in elements:
        description_table = elm.find_element_by_class_name("subline-level-1")
        if 'name' in description_table.text.lower():

        # print(elm.location)
            try:
                image = elm.find_elements_by_class_name("EntityPhoto-circle-4");
                print(image)
                imageUrl = image[0].value_of_css_property("background-image")
                # print(imageUrl[5:-2])
                save_picture(imageUrl[5:-2], row_first + '_' + row_last)
                return True
            except:
                return False
    # next_button.click()

    return False

def save_to_csv(filename, login_time, contacts_time, open_contact_time, deals_time, open_deal_time, organization_contacts_time):
    time = get_time_est().strftime("%d/%m/%Y %H:%M EST")
    with open(filename, 'a') as file:
        writer = csv.writer(file)
        # format times with 2 decimal places
        writer.writerow([format_time(login_time), format_time(contacts_time), format_time(open_contact_time), format_time(deals_time), format_time(open_deal_time), format_time(organization_contacts_time), time])

def save_to_js(filename, login_time, contacts_time, open_contact_time, deals_time, open_deal_time, organization_contacts_time):
    # time = get_time_est().strftime("%d/%m/%Y %H:%M")
    import time
    time = format_time(time.time())
    with open(filename) as file:
        fileJSON = json.load(file)
        data = fileJSON["dates"]
        data.append([time, format_time(login_time), format_time(contacts_time), format_time(open_contact_time), format_time(deals_time), format_time(open_deal_time), format_time(organization_contacts_time)])

    with open(filename, "w") as outfile:
        json.dump({'dates': data}, outfile, indent=4)

def format_time(time):
    return float("{:.2f}".format(time))

def get_time_est():
    etc_timezone = pytz.timezone('US/Eastern')
    utc = pytz.utc
    etc_time = utc.localize(datetime.utcnow()).astimezone(etc_timezone)
    return etc_time

def save_picture(url_path, name):
    FOLDER_NAME = os.path.dirname(os.path.realpath(__file__))+ '/pictures/'
    file_name = os.path.join(FOLDER_NAME, name + ".jpg")
    wget.download(url_path, file_name)

    #img_data = requests.get(url_path).content
    #with open(file_name, 'wb') as handler:
    #    handler.write(img_data)
    return True

def scroll_page(driver):
    SCROLL_PAUSE_TIME = 0.5

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(SCROLL_PAUSE_TIME)

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    return ""

if __name__ == "__main__":
    main()