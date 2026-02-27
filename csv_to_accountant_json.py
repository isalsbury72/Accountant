#!/usr/bin/env python3
"""Convert supplier/invoice CSV files into Accountant PWA JSON import format."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, Iterable, List, Optional


def norm(value: str) -> str:
    return "".join(ch for ch in value.strip().lower() if ch.isalnum())


def pick(row: Dict[str, str], aliases: Iterable[str], default: str = "") -> str:
    if not row:
        return default
    normalized = {norm(k): (v or "").strip() for k, v in row.items()}
    for alias in aliases:
        v = normalized.get(norm(alias))
        if v is not None and v != "":
            return v
    return default


def parse_amount(raw: str) -> float:
    if not raw:
        return 0.0
    cleaned = raw.replace("$", "").replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def load_csv(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return [dict(row) for row in reader]


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert suppliers + invoices CSV to Accountant JSON")
    parser.add_argument("--suppliers", required=True, type=Path, help="Suppliers CSV path")
    parser.add_argument("--invoices", required=True, type=Path, help="Invoices CSV path")
    parser.add_argument("--out", required=True, type=Path, help="Output JSON path")
    args = parser.parse_args()

    supplier_rows = load_csv(args.suppliers)
    invoice_rows = load_csv(args.invoices)

    suppliers: List[Dict[str, object]] = []
    suppliers_by_name: Dict[str, int] = {}

    def ensure_supplier(name: str, row: Optional[Dict[str, str]] = None) -> Optional[int]:
        clean = (name or "").strip()
        if not clean:
            return None
        key = clean.lower()
        existing = suppliers_by_name.get(key)
        if existing is not None:
            return existing

        supplier_id = len(suppliers) + 1
        payload = {
            "id": supplier_id,
            "name": clean,
            "address": pick(row or {}, ["address", "supplier_address"]),
            "phone": pick(row or {}, ["phone", "supplier_phone", "mobile"]),
            "defaultCategory": pick(row or {}, ["default_category", "category"]),
            "defaultSubCategory": pick(row or {}, ["default_sub_category", "subcategory", "sub_category"]),
        }
        suppliers.append(payload)
        suppliers_by_name[key] = supplier_id
        return supplier_id

    for row in supplier_rows:
        supplier_name = pick(row, ["name", "supplier", "supplier_name", "vendor", "company"])
        ensure_supplier(supplier_name, row)

    expenses: List[Dict[str, object]] = []

    for row in invoice_rows:
        supplier_name = pick(row, ["supplier", "supplier_name", "vendor", "name", "company"])
        supplier_id = ensure_supplier(supplier_name)
        date_value = pick(row, ["date", "invoice_date", "transaction_date"], default="")
        amount_value = parse_amount(pick(row, ["amount", "total", "invoice_total", "value"], default="0"))

        expense = {
            "id": len(expenses) + 1,
            "date": date_value,
            "supplierId": supplier_id,
            "supplierName": supplier_name,
            "category": pick(row, ["category", "expense_category"], default="Uncategorised"),
            "subCategory": pick(row, ["subcategory", "sub_category", "expense_subcategory"], default=""),
            "amount": amount_value,
            "description": pick(row, ["description", "memo", "notes", "item"], default=""),
            "invoiceFileId": None,
        }
        expenses.append(expense)

    payload = {"suppliers": suppliers, "expenses": expenses, "files": []}
    args.out.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    print(f"Wrote {args.out}")
    print(f"Suppliers: {len(suppliers)}")
    print(f"Expenses: {len(expenses)}")


if __name__ == "__main__":
    main()
