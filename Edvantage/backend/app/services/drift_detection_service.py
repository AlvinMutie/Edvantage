import numpy as np
from scipy import stats
import pandas as pd

class DriftDetectionService:
    def __init__(self, threshold=0.05):
        self.threshold = threshold

    def detect_data_drift(self, reference_data, current_data):
        """
        Detects drift in feature distributions using the KS test.
        """
        drift_results = {}
        for column in reference_data.columns:
            if column not in current_data.columns:
                continue
            
            # KS test for distribution shift
            statistic, p_value = stats.ks_2samp(reference_data[column], current_data[column])
            drift_results[column] = {
                'is_drift': p_value < self.threshold,
                'p_value': float(p_value),
                'statistic': float(statistic)
            }
        
        overall_drift = any(res['is_drift'] for res in drift_results.values())
        return overall_drift, drift_results

    def detect_prediction_drift(self, reference_predictions, current_predictions):
        """
        Detects drift in the output distribution (risk levels).
        """
        ref_counts = pd.Series(reference_predictions).value_counts(normalize=True).sort_index()
        cur_counts = pd.Series(current_predictions).value_counts(normalize=True).sort_index()
        
        # Ensure indices match
        all_indices = sorted(list(set(ref_counts.index) | set(cur_counts.index)))
        ref_counts = ref_counts.reindex(all_indices, fill_value=0)
        cur_counts = cur_counts.reindex(all_indices, fill_value=0)
        
        # Population Stability Index (PSI) simplified
        # For now, let's just use a simple difference in proportions
        diff = np.abs(ref_counts - cur_counts).sum()
        
        return diff > 0.2, float(diff) # 20% shift threshold

    def detect_concept_drift(self, model, X, y):
        """
        Concept drift usually manifests as performance degradation.
        If accuracy drops significantly below training accuracy, it suggests concept drift.
        """
        # This is often handled by LearningEvaluationService comparing with previous versions.
        return False, 0.0

drift_detection_service = DriftDetectionService()
