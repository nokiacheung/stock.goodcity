#!/bin/sh
# https://github.com/testfairy/command-line-uploader/blob/master/testfairy-upload.sh

UPLOADER_VERSION=1.09

# Put your TestFairy API_KEY here. Find it in your TestFairy account settings.
# TESTFAIRY_API_KEY= # added as environment variable on circleci

# Tester Groups that will be notified when the app is ready. Setup groups in your TestFairy account testers page.
# This parameter is optional, leave empty if not required
TESTER_GROUPS=

# Should email testers about new version. Set to "off" to disable email notifications.
NOTIFY="off"

# If AUTO_UPDATE is "on" all users will be prompt to update to this build next time they run the app
AUTO_UPDATE="on"

# The maximum recording duration for every test.
MAX_DURATION="10m"

# Is video recording enabled for this build
VIDEO="on"

# Add a TestFairy watermark to the application icon?
ICON_WATERMARK="on"

# Comment text will be included in the email sent to testers
COMMENT="Uploaded on `date`"

# locations of various tools
CURL=curl
ZIPALIGN=zipalign

SERVER_ENDPOINT=http://app.testfairy.com

usage() {
  echo "Usage: testfairy-android-upload.sh APK_FILENAME"
  echo
}

verify_tools() {

  # Windows users: this script requires zip, curl and sed. If not installed please get from http://cygwin.com/

  # Check 'curl' tool
  ${CURL} --help >/dev/null
  if [ $? -ne 0 ]; then
    echo "Could not run curl tool, please check settings"
    exit 1
  fi

  # Check 'zipalign' tool
  OUTPUT=$( ${ZIPALIGN} 2>&1 | grep -i "Zip alignment" )
  if [ $? -ne 0 ]; then
    echo "Could not run zipalign tool, please check settings"
    exit 1
  fi
}

if [ $# -ne 1 ]; then
  usage
  exit 1
fi

# before even going on, make sure all tools work
verify_tools

APK_FILENAME=$1
if [ ! -f "${APK_FILENAME}" ]; then
  usage
  echo "Can't find file: ${APK_FILENAME}"
  exit 2
fi

# temporary file paths
DATE=`date`
TMP_FILENAME=.testfairy.upload.apk
ZIPALIGNED_FILENAME=.testfairy.zipalign.apk
rm -f "${TMP_FILENAME}" "${ZIPALIGNED_FILENAME}"

/bin/echo -n "Uploading ${APK_FILENAME} to TestFairy.. "
JSON=$( ${CURL} -s ${SERVER_ENDPOINT}/api/upload -F api_key=${TESTFAIRY_API_KEY} -F apk_file="@${APK_FILENAME}" -F icon-watermark="${ICON_WATERMARK}" -F video="${VIDEO}" -F max-duration="${MAX_DURATION}"  -F auto-update="${AUTO_UPDATE}" -F comment="${COMMENT}" -A "TestFairy Command Line Uploader ${UPLOADER_VERSION}" )

URL=$( echo ${JSON} | sed 's/\\\//\//g' | sed -n 's/.*"instrumented_url"\s*:\s*"\([^"]*\)".*/\1/p' )
if [ -z "${URL}" ]; then
  echo "FAILED!"
  echo
  echo "Upload failed, please check your settings"
  exit 1
fi

echo "OK!"
echo
echo "Build was successfully uploaded to TestFairy and is available at:"
echo ${URL}
