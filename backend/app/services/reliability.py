import numpy as np
from sklearn.linear_model import LogisticRegression
import pickle
import os

class ReliabilityClassifier:
    def __init__(self):
        self.model = LogisticRegression()
        self._is_trained = False
        self._initialize_baseline_model()

    def _initialize_baseline_model(self):
        # Synthetic baseline training set representing maritime report patterns:
        # Features: [verified_ratio, false_alarm_ratio, evidence_has_media, completeness_score, climate_match_score]
        X_train = np.array([
            [1.0, 0.0, 1, 1.0, 0.95],
            [0.8, 0.1, 1, 0.8, 0.85],
            [0.6, 0.2, 0, 0.7, 0.70],
            [0.2, 0.7, 0, 0.3, 0.20],
            [0.0, 0.9, 0, 0.2, 0.10],
            [0.5, 0.5, 1, 0.5, 0.50],
            [0.9, 0.0, 1, 0.9, 0.90],
            [0.1, 0.8, 0, 0.4, 0.15],
            [0.7, 0.1, 1, 0.7, 0.80],
            [0.3, 0.6, 0, 0.4, 0.30],
        ])
        y_train = np.array([1, 1, 1, 0, 0, 0, 1, 0, 1, 0])
        self.model.fit(X_train, y_train)
        self._is_trained = True

    def predict_reliability(
        self,
        verified_count: int,
        false_alarm_count: int,
        has_media: bool,
        description_length: int,
        climate_match_score: float
    ) -> dict:
        total_reports = verified_count + false_alarm_count
        if total_reports < 5:
            # Fallback incremental base calculation for new users
            base_score = 0.5 + (0.10 * verified_count) - (0.15 * false_alarm_count)
            base_score = max(0.05, min(0.95, base_score))
            return {
                "reliability_score": round(base_score, 3),
                "is_gold_highlighted": base_score >= 0.85,
                "model_type": "rule_based_fallback",
                "sample_size": total_reports
            }

        verified_ratio = verified_count / total_reports
        false_alarm_ratio = false_alarm_count / total_reports
        completeness_score = min(1.0, max(0.1, description_length / 100.0))
        media_flag = 1 if has_media else 0

        features = np.array([[
            verified_ratio,
            false_alarm_ratio,
            media_flag,
            completeness_score,
            climate_match_score
        ]])

        prob = self.model.predict_proba(features)[0][1]
        return {
            "reliability_score": round(float(prob), 3),
            "is_gold_highlighted": prob >= 0.85,
            "model_type": "scikit_learn_logistic_regression",
            "sample_size": total_reports
        }

classifier = ReliabilityClassifier()

def get_reliability_classifier() -> ReliabilityClassifier:
    return classifier
