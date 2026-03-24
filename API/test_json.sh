#!/usr/bin/bash

echo "=== JSON Validator Tests ==="

run_test() {
    echo ""
    echo "--- Test: $1 ---"
    curl -s -X POST http://localhost:5224/api/json/validate \
        -H "Content-Type: application/json" \
        -d "{\"json\": \"$2\"}" | python3 -m json.tool 2>/dev/null || \
    curl -s -X POST http://localhost:5224/api/json/validate \
        -H "Content-Type: application/json" \
        -d "{\"json\": \"$2\"}"
    echo ""
}

# Object & Key Errors
run_test "name John" '{\"name\":\"John\",\"age\":30}'
run_test "name John no colon" '{\"name\" \"John\",\"age\" 30}'
run_test "name John minimal" '{name"John", age 30}'

echo ""
echo "=== Done ==="
