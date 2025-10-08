# 🔌 **REDDIT AUTOMATION API REFERENCE**

## **Base URL:** `http://localhost:3001`  
**Version:** 1.0.0  
**Authentication:** Bearer Token or Basic Auth

---

## 🔐 **AUTHENTICATION**

### **Bearer Token**
```http
Authorization: Bearer <your-token>
```

### **Basic Authentication**
```http
Authorization: Basic <base64(username:password)>
```

---

## 📊 **REDDIT AUTOMATION ENDPOINTS**

### **GET /api/reddit-automation/status**
Get current automation status and statistics.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "is_running": true,
  "active_rules": 2,
  "actions_today": 21,
  "connected_accounts": ["account1", "account2"],
  "last_updated": "2025-10-06T13:35:51.325Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

### **GET /api/reddit-automation/rules**
Get all automation rules.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Tech News Auto Engagement",
    "type": "auto_comment",
    "enabled": true,
    "config": {
      "subreddits": ["technology", "programming"],
      "keywords": ["AI", "blockchain", "startup"],
      "comment_templates": [
        "Great article! Thanks for sharing.",
        "This is really interesting, looking forward to seeing how this develops."
      ],
      "delay_min": 120,
      "delay_max": 480,
      "daily_limit": 20,
      "conditions": {
        "min_upvotes": 5,
        "max_age_hours": 12
      }
    },
    "stats": {
      "total_actions": 156,
      "actions_today": 8,
      "last_run": "2025-10-06T13:35:51.325Z",
      "success_rate": 94
    }
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

### **POST /api/reddit-automation/rules**
Create a new automation rule.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Automation Rule",
  "type": "auto_comment",
  "enabled": true,
  "config": {
    "subreddits": ["technology", "programming"],
    "keywords": ["AI", "blockchain", "startup"],
    "comment_templates": [
      "Great article! Thanks for sharing.",
      "This is really interesting, looking forward to seeing how this develops."
    ],
    "delay_min": 120,
    "delay_max": 480,
    "daily_limit": 20,
    "conditions": {
      "min_upvotes": 5,
      "max_age_hours": 12
    }
  }
}
```

**Response:**
```json
{
  "id": "rule_1759757714697",
  "name": "New Automation Rule",
  "type": "auto_comment",
  "enabled": true,
  "config": {
    "subreddits": ["technology", "programming"],
    "keywords": ["AI", "blockchain", "startup"],
    "comment_templates": [
      "Great article! Thanks for sharing.",
      "This is really interesting, looking forward to seeing how this develops."
    ],
    "delay_min": 120,
    "delay_max": 480,
    "daily_limit": 20,
    "conditions": {
      "min_upvotes": 5,
      "max_age_hours": 12
    }
  },
  "stats": {
    "total_actions": 0,
    "actions_today": 0,
    "success_rate": 0
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Server Error

---

### **PUT /api/reddit-automation/rules/[id]/toggle**
Toggle the enabled status of a rule.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "enabled": false
}
```

**Response:**
```json
{
  "id": "1",
  "enabled": false,
  "updated_at": "2025-10-06T13:35:49.052Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Rule Not Found
- `500` - Server Error

---

### **POST /api/reddit-automation/start**
Start the Reddit automation system.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Reddit automation started successfully",
  "started_at": "2025-10-06T13:35:51.325Z",
  "status": "running"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

### **POST /api/reddit-automation/stop**
Stop the Reddit automation system.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Reddit automation stopped successfully",
  "stopped_at": "2025-10-06T13:35:51.325Z",
  "status": "stopped"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

## 🔗 **REDDIT OAUTH ENDPOINTS**

### **POST /api/reddit/oauth/start**
Initiate Reddit OAuth flow.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "auth_url": "https://www.reddit.com/api/v1/authorize?client_id=...",
  "state": "random-state-string"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

### **GET /api/reddit-oauth/status**
Get Reddit OAuth connection status.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "connected": false,
  "reddit_username": "Economy-Cattle-1602",
  "reddit_user_id": "Economy-Cattle-1602",
  "token_expires_at": "2025-10-06T06:37:32.118904+00:00",
  "has_refresh_token": true
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server Error

---

## 🛠️ **DEBUG ENDPOINTS**

### **POST /api/debug/log-response**
Log API responses for debugging.

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "endpoint": "reddit-oauth-status",
  "timestamp": "2025-10-06T13:13:24.088Z",
  "response": {
    "connected": false,
    "reddit_username": "Economy-Cattle-1602"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Response logged"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server Error

---

### **GET /api/debug/mock-reddit-status**
Get mock Reddit status for testing.

**Response:**
```json
{
  "connected": true,
  "reddit_username": "test_user",
  "reddit_user_id": "test_user_id",
  "token_expires_at": "2025-10-07T06:37:32.118904+00:00",
  "has_refresh_token": true
}
```

**Status Codes:**
- `200` - Success

---

### **GET /api/debug/test-reddit-connection**
Test Reddit connection and provide instructions.

**Response:**
```json
{
  "message": "Reddit connection test endpoint",
  "instructions": [
    "1. Go to /social-accounts",
    "2. Click 'Connect Reddit'",
    "3. Authorize the application",
    "4. Check the status"
  ]
}
```

**Status Codes:**
- `200` - Success

---

### **GET /api/debug/check-multiple-accounts**
Check various potential ADTASK API endpoints for multiple Reddit accounts.

**Response:**
```json
{
  "message": "Multiple accounts check completed",
  "results": {
    "single_account_endpoint": "Available",
    "multiple_accounts_endpoint": "Not available",
    "recommendation": "Use localStorage for multiple accounts"
  }
}
```

**Status Codes:**
- `200` - Success

---

## 📋 **DATA TYPES**

### **AutomationStatus**
```typescript
interface AutomationStatus {
  is_running: boolean;
  active_rules: number;
  actions_today: number;
  connected_accounts: string[];
  last_updated: string;
}
```

### **AutomationRule**
```typescript
interface AutomationRule {
  id: string;
  name: string;
  type: 'auto_comment' | 'auto_upvote' | 'auto_follow';
  enabled: boolean;
  config: RuleConfig;
  stats: RuleStats;
}
```

### **RuleConfig**
```typescript
interface RuleConfig {
  subreddits: string[];
  keywords: string[];
  comment_templates?: string[];
  delay_min: number;
  delay_max: number;
  daily_limit: number;
  conditions: {
    min_upvotes?: number;
    max_age_hours?: number;
  };
}
```

### **RuleStats**
```typescript
interface RuleStats {
  total_actions: number;
  actions_today: number;
  last_run: string;
  success_rate: number;
}
```

### **ErrorResponse**
```typescript
interface ErrorResponse {
  error: string;
  message?: string;
  status: number;
}
```

---

## 🚨 **ERROR CODES**

| Code | Description | Solution |
|------|-------------|----------|
| `400` | Bad Request | Check request body format |
| `401` | Unauthorized | Provide valid authentication |
| `404` | Not Found | Check endpoint URL |
| `500` | Server Error | Check server logs |

---

## 📊 **RATE LIMITS**

- **Status Endpoint**: 10 requests/minute
- **Rules Endpoint**: 20 requests/minute
- **Start/Stop**: 5 requests/minute
- **OAuth**: 5 requests/minute

---

## 🔄 **FALLBACK BEHAVIOR**

When ADTASK backend is unavailable:
- **Status**: Returns mock data
- **Rules**: Returns mock rules
- **Start/Stop**: Returns success response
- **Toggle**: Returns success response

---

## 📝 **EXAMPLES**

### **cURL Examples**

#### **Get Status**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/reddit-automation/status
```

#### **Create Rule**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Rule", "type": "auto_comment", "enabled": true}' \
  http://localhost:3001/api/reddit-automation/rules
```

#### **Start Automation**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  http://localhost:3001/api/reddit-automation/start
```

### **JavaScript Examples**

#### **Get Status**
```javascript
const response = await fetch('/api/reddit-automation/status', {
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  }
});
const status = await response.json();
```

#### **Create Rule**
```javascript
const response = await fetch('/api/reddit-automation/rules', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Rule',
    type: 'auto_comment',
    enabled: true,
    config: {
      subreddits: ['technology'],
      keywords: ['AI'],
      daily_limit: 10
    }
  })
});
const rule = await response.json();
```

---

**Last Updated:** October 6, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

