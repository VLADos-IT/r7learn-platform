import requests
import time
import sys

ADMIN_URL = "http://r7l-admin-panel:80"
FRONTEND_URL = "http://r7l-frontend:80"
BACKEND_API_URL = "http://r7l-backend:5000/api"


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
    print(f"Timeout waiting for {url}")
    return False


def check(url, expect_json=False):
    try:
        r = requests.get(url, timeout=10)
        print(f"{url} status: {r.status_code}")
        if r.status_code >= 400:
            print(f"Response: {r.text[:500]}")
            sys.exit(1)
        if expect_json:
            print(f"JSON: {r.json()}")
        else:
            print(f"Content (first 200 chars):\n{r.text[:200]}")
    except Exception as ex:
        print(f"Error checking {url}: {ex}")
        sys.exit(1)


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

    print("Integration test finished successfully.")
