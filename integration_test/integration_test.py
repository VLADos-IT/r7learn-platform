import requests
import time
import sys
import os

ADMIN_URL = "http://r7l-admin-panel:80"
FRONTEND_URL = "http://r7l-frontend:80"
BACKEND_API_URL = "http://r7l-backend:5000/api"
ERROR_LOG = "/app/error_log"


def log_and_exit(message):
    print(message)
    try:
        with open(ERROR_LOG, "a") as f:
            f.write(message + "\n")
    except Exception as ex:
        print(f"Failed to write to error_log: {ex}")
    os.system("docker compose down --remove-orphans")
    sys.exit(1)


def wait_for_service(url, timeout=120):
    print(f"Waiting for {url} ...")
    for i in range(timeout):
        try:
            r = requests.get(url, timeout=5)
            if r.status_code < 500:
                print(f"{url} is up: {r.status_code}")
                return True
        except Exception as ex:
            print(f"Attempt {i+1}: {ex}")
        time.sleep(2)
    log_and_exit(f"Timeout waiting for {url}")
    return False


def check(url, expect_json=False):
    try:
        r = requests.get(url, timeout=10)
        print(f"{url} status: {r.status_code}")
        if r.status_code >= 400:
            msg = f"Response: {r.text[:500]}"
            log_and_exit(f"{url} failed with status {r.status_code}\n{msg}")
        if expect_json:
            print(f"JSON: {r.json()}")
        else:
            print(f"Content (first 200 chars):\n{r.text[:200]}")
    except Exception as ex:
        log_and_exit(f"Error checking {url}: {ex}")


def check_404(url):
    try:
        r = requests.get(url, timeout=10)
        print(f"{url} status: {r.status_code} (expected 404)")
        if r.status_code != 404:
            log_and_exit(f"Expected 404, got {r.status_code} for {url}")
    except Exception as ex:
        log_and_exit(f"Error checking {url}: {ex}")


if __name__ == "__main__":
    # Wait for backend
    assert wait_for_service(
        f"{BACKEND_API_URL}/Course/GetAllCourses"), "Backend not available"
    assert wait_for_service(f"{FRONTEND_URL}/"), "Frontend not available"
    assert wait_for_service(f"{ADMIN_URL}/"), "Admin panel not available"

    # Check endpoints
    check(f"{ADMIN_URL}/")
    check(f"{FRONTEND_URL}/")
    check(f"{BACKEND_API_URL}/Course/GetAllCourses", expect_json=True)

    check_404(f"{ADMIN_URL}/nonexistent")
    check_404(f"{FRONTEND_URL}/nonexistent")
    check_404(f"{BACKEND_API_URL}/nonexistent")

    print("Integration test finished successfully.")
