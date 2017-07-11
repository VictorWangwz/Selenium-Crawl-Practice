import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from datetime import datetime
import csv

CSV_FILENAME = "data.csv"

def main():
    driver = create_driver()

    login_time = get_login_time(driver)
    contacts_time = get_contacts_load_time(driver)

    logout(driver)
    driver.quit()

    save_to_csv(CSV_FILENAME, login_time, contacts_time)

# If chromedriver.exe is not found in this project directory, please download from
# http://chromedriver.storage.googleapis.com/index.html?path=2.30/
# and extract the file into the same directory as this file
def create_driver():
    # get the path of ChromeDriver
    dir = os.path.dirname(os.path.realpath(__file__))
    chrome_driver_path = dir + "/chromedriver"

    # create a new Chrome session
    driver = webdriver.Chrome(chrome_driver_path)
    driver.implicitly_wait(30)
    driver.maximize_window()

    return driver

# logs into MortgageBoss and returns the time taken for the "3 days" tab to load
def get_login_time(driver):
    MORTGAGE_BOSS_URL = "https://mortgageboss.ca/login.aspx"
    TEST_USER = "lucaisho"
    TEST_PASS = "password1"

    # navigate to the application home page
    driver.get(MORTGAGE_BOSS_URL)

    # enter username
    USERNAME_TEXTFIELD_ID = "Username"
    username_textfield = driver.find_element_by_id(USERNAME_TEXTFIELD_ID)
    username_textfield.clear()
    username_textfield.send_keys(TEST_USER)

    # enter password
    PASSWORD_TEXTFIELD_ID = "Password"
    password_textfield = driver.find_element_by_id(PASSWORD_TEXTFIELD_ID)
    password_textfield.clear()
    password_textfield.send_keys(TEST_PASS)

    # submit credentials
    password_textfield.submit()
    login_start_time = time.time()

    # switch to active tab
    driver.switch_to.window(driver.window_handles[1])

    # wait until "3 Days" tab is clickable (this could be replaced with any element on the homepage)
    THREE_DAYS_TAB_XPATH = "//*[@id=\"ctl06_home_tabs_a_tab_1\"]"
    WEB_DRIVER_TIMEOUT_SECS = 600
    wait = WebDriverWait(driver, WEB_DRIVER_TIMEOUT_SECS)
    three_days_tab = wait.until(EC.element_to_be_clickable((By.XPATH, THREE_DAYS_TAB_XPATH)))

    login_end_time = time.time()
    login_delta_secs = login_end_time - login_start_time

    return login_delta_secs

# presses on the "Contacts" tab and returns the time taken for data table to load
def get_contacts_load_time(driver):
    # click on "Contacts" tab
    CONTACTS_TAB_XPATH = "//*[@id=\"module_5\"]"
    contacts_tab = driver.find_element_by_xpath(CONTACTS_TAB_XPATH)
    contacts_tab.click()
    contacts_start_time = time.time()

    # wait until "A" button in data table navigation is clickable
    A_BUTTON_XPATH = "//*[@id=\"a_letter_A\"]"
    WEB_DRIVER_TIMEOUT_SECS = 600
    wait = WebDriverWait(driver, WEB_DRIVER_TIMEOUT_SECS)
    a_button = wait.until(EC.element_to_be_clickable((By.XPATH, A_BUTTON_XPATH)))
    contacts_end_time = time.time()

    contacts_delta_secs = contacts_end_time - contacts_start_time

    return contacts_delta_secs

def save_to_csv(filename, login_time, contacts_time):
    time = datetime.utcnow().strftime("%d/%m/%Y %H:%M UTC")
    with open(filename, 'a') as file:
        writer = csv.writer(file)
        # format times with 2 decimal places
        writer.writerow(["{:.2f}".format(login_time), "{:.2f}".format(contacts_time), time])

def logout(driver):
    LOGOUT_XPATH = "//*[@id=\"header\"]/div[3]/a[4]"
    logout_button = driver.find_element_by_xpath(LOGOUT_XPATH)
    logout_button.click()

if __name__ == "__main__":
    main()