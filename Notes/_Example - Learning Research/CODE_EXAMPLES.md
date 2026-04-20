# 💻 Code Examples

## Linear Regression

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Predict
y_pred = model.predict([[6]])
print(f"Prediction for X=6: {y_pred[0]}")
```

## Logistic Regression (Classification)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.dataset import load_iris

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Train model
model = LogisticRegression(max_iter=200)
model.fit(X, y)

# Predict
prediction = model.predict([[5.1, 3.5, 1.4, 0.2]])
print(f"Predicted class: {prediction[0]}")
```

## Model Evaluation

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
```

---

**Reference**: [[REFERENCES.md]]
